import * as THREE from 'three';

const DPR = () => Math.min(window.devicePixelRatio || 1, 2);
const NOISE = `
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
`;

/* =========================================================
   1) THE MIRROR — real reels inside a capsule floor-mirror
   (the round mirror is in every Special Me shot)
   ========================================================= */
export function initMirror(canvas, host, reels, cb) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(DPR());
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(28, 0.6, 0.1, 50);
  cam.position.z = 5;
  const ASP = 0.6;
  const H = (2 * 5 * Math.tan(THREE.MathUtils.degToRad(14))) / 1.08;
  const geo = new THREE.PlaneGeometry(H * ASP, H, 1, 1);

  const blank = new THREE.DataTexture(new Uint8Array([214, 209, 202, 255]), 1, 1); blank.needsUpdate = true;
  const U = {
    tA: { value: blank }, tB: { value: blank }, uMix: { value: 0 }, uTime: { value: 0 },
    uPtr: { value: new THREE.Vector2() }, uAsp: { value: ASP }, uVA: { value: 0.5625 }, uVB: { value: 0.5625 }
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true,
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `precision highp float;
      uniform sampler2D tA,tB; uniform float uMix,uTime,uAsp,uVA,uVB; uniform vec2 uPtr; varying vec2 vUv;
      ${NOISE}
      vec2 cover(vec2 uv,float va){ float s=va/uAsp; return vec2(uv.x,(uv.y-.5)*s+.5); }
      void main(){
        vec2 p=(vUv-.5)*vec2(uAsp,1.);
        float rad=uAsp*.5, h=.5-rad;
        vec2 dv=p-vec2(0.,clamp(p.y,-h,h));
        float d=length(dv)-rad;
        if(d>.004) discard;
        vec2 n=normalize(dv+1e-5);
        float edge=smoothstep(-.10,0.,d);
        vec2 uv=vUv - n*pow(edge,3.)*.045/vec2(uAsp,1.);
        uv+=uPtr*vec2(-.014,.010);
        // liquid wipe between reels
        float nz=noise(vUv*vec2(3.,5.)+uTime*.04)*.55+(1.-vUv.y)*.45;
        float e=uMix*1.5-.25;
        float wB=1.-smoothstep(e-.18,e,nz);
        float glow=smoothstep(e-.18,e-.09,nz)*(1.-smoothstep(e-.09,e,nz));
        vec2 off=n*glow*.02;
        vec3 A=texture2D(tA,cover(uv-off,uVA)).rgb;
        vec3 B=texture2D(tB,cover(uv+off,uVB)).rgb;
        vec3 col=mix(A,B,wB);
        col+=glow*vec3(.22,.20,.18);
        // glass sheen following the pointer
        float s=p.x*.8+p.y*.35-uPtr.x*.2+uPtr.y*.1;
        col+=exp(-pow((s-.04)*8.,2.))*.09+exp(-pow((s-.16)*28.,2.))*.05;
        col*=1.-edge*edge*.22;
        // chrome frame
        float rimW=.02;
        float rim=smoothstep(-rimW-.003,-rimW,d);
        vec2 L=normalize(vec2(-.45,.85)+uPtr*.7);
        float spec=pow(max(dot(n,L),0.),8.);
        float tone=.70+.16*n.y-.10*n.x+.38*spec;
        tone-=.18*smoothstep(-rimW*.5,0.,d);
        vec3 chrome=vec3(tone)*vec3(.99,.97,.94);
        col=mix(col,chrome,rim);
        col*=1.-.35*exp(-pow((d+rimW)*500.,2.));
        float a=1.-smoothstep(-.002,.004,d);
        gl_FragColor=vec4(col,a);
      }`
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // video handling
  const vids = new Map();
  let curI = -1, curV = null, nextV = null, paused = false, visible = true, tween = null, readySent = false;
  function vidFor(i) {
    const p = reels[i];
    const v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'auto'; v.crossOrigin = 'anonymous';
    v.src = '' + p.v;
    v.addEventListener('timeupdate', () => { if (v === curV && v.duration) cb.onProgress(v.currentTime / v.duration); });
    v.addEventListener('ended', () => { if (v === curV) cb.onEnded(); });
    return v;
  }
  function texOf(v) { const t = new THREE.VideoTexture(v); t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false; return t; }
  function release(v) { if (!v) return; v.pause(); v.removeAttribute('src'); v.load(); }
  // poster first so the mirror is never empty
  new THREE.TextureLoader().load('' + (reels[0].f ? reels[0].f[1] : reels[0].img), tex => { if (U.tA.value === blank) U.tA.value = tex; if (!readySent) { readySent = true; cb.onReady(); } });

  function go(i) {
    if (i === curI) return;
    const v = vidFor(i);
    const first = curI === -1;
    curI = i;
    if (nextV && nextV !== curV) release(nextV);
    nextV = v;
    const start = () => {
      if (nextV !== v) return;
      const tex = texOf(v);
      if (first) {
        U.tA.value = tex; curV = v; nextV = null;
        return;
      }
      U.tB.value = tex; U.uMix.value = 0;
      const old = curV; curV = v;
      if (tween) tween.kill();
      tween = gsap.to(U.uMix, { value: 1, duration: 1.5, ease: 'power2.inOut', onComplete: () => {
        U.tA.value = tex; U.uMix.value = 0; release(old); nextV = null;
      } });
    };
    v.addEventListener('playing', start, { once: true });
    if (!paused && visible) v.play().catch(() => {});
  }

  // pointer
  const ptr = new THREE.Vector2(), ptrT = new THREE.Vector2();
  const hoverable = matchMedia('(hover: hover)').matches;
  if (hoverable) addEventListener('pointermove', e => {
    const r = host.getBoundingClientRect();
    ptrT.set(THREE.MathUtils.clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth / 2), -1, 1), THREE.MathUtils.clamp(-(e.clientY - (r.top + r.height / 2)) / (innerHeight / 2), -1, 1));
  }, { passive: true });

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    renderer.setSize(r.width, r.height, false);
    cam.aspect = r.width / r.height; cam.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; sync(); });
  io.observe(host);
  document.addEventListener('visibilitychange', () => sync());
  function sync() {
    const run = visible && !paused && !document.hidden;
    [curV, nextV].forEach(v => { if (!v) return; run ? v.play().catch(() => {}) : v.pause(); });
    if (run) loop();
  }
  let raf = 0; const clock = new THREE.Clock();
  function loop() {
    cancelAnimationFrame(raf);
    const tick = () => {
      if (!visible || paused || document.hidden) return;
      const t = clock.getElapsedTime();
      if (!hoverable) ptrT.set(Math.sin(t * .35) * .35, Math.sin(t * .27) * .18);
      ptr.lerp(ptrT, .06);
      U.uPtr.value.copy(ptr); U.uTime.value = t;
      mesh.rotation.y = ptr.x * .2; mesh.rotation.x = -ptr.y * .12;
      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  loop();
  return { go, pause(on) { paused = on; sync(); } };
}

/* =========================================================
   2) THE RAIL — the week's looks hang on a turning rail,
   swinging with the speed of scroll / drag
   ========================================================= */
export function initRail(canvas, section, items, cb) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(DPR());
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(34, 1, .1, 100);
  const N = items.length;
  const root = new THREE.Group(); scene.add(root);
  const loader = new THREE.TextureLoader();
  const blank = new THREE.DataTexture(new Uint8Array([214, 209, 202, 255]), 1, 1); blank.needsUpdate = true;

  let cfg;
  function layout() {
    const mob = innerWidth < 760;
    cfg = mob ? { rx: 3.1, rz: 3.1, w: 1.2, camZ: 10.4, camY: 1.9, railY: 1.35, look: .25 } : { rx: 3.5, rz: 2.1, w: 1.2, camZ: 9.2, camY: 2.1, railY: 1.35, look: .45 };
    cfg.h = cfg.w / .6;
  }
  layout();

  const pivots = [], mats = [];
  const vs = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
  const fs = `precision highp float; uniform sampler2D map; uniform float uDim,uAsp,uTA,uHi; varying vec2 vUv;
    void main(){
      vec2 uv=vUv; if(!gl_FrontFacing) uv.x=1.-uv.x;
      vec2 p=(vUv-.5)*vec2(uAsp,1.); float r=uAsp*.5; float cy=.5-r;
      float d = p.y>cy ? length(p-vec2(0.,cy))-r : max(abs(p.x)-r, -.5-p.y);
      float a=1.-smoothstep(-.003,.003,d);
      if(a<.01) discard;
      // cover-fit texture
      float s=uTA/uAsp; vec2 tuv = s<1. ? vec2(uv.x,(uv.y-.5)*s+.5) : vec2((uv.x-.5)/s+.5,uv.y);
      vec3 c=texture2D(map,tuv).rgb;
      if(!gl_FrontFacing) c=mix(c*.35,vec3(.80,.78,.75),.35);
      c+=uHi*.06*(1.-vUv.y);
      c=mix(c,vec3(.953,.945,.929),uDim);
      gl_FragColor=vec4(c,a);
    }`;
  const lineMat = new THREE.LineBasicMaterial({ color: 0x8f8a84, transparent: true, opacity: .9 });

  function hangerGeo(w) {
    const pts = [];
    for (let k = 0; k <= 10; k++) { const a = Math.PI * (k / 10); pts.push(new THREE.Vector3(Math.cos(a) * .05, Math.sin(a) * .05 + .0, 0)); }
    const seg = [];
    for (let k = 0; k < pts.length - 1; k++) seg.push(pts[k], pts[k + 1]);
    const top = new THREE.Vector3(-.05, 0, 0), neck = new THREE.Vector3(-.0, -.1, 0);
    seg.push(top, new THREE.Vector3(-.05, -.04, 0), new THREE.Vector3(-.05, -.04, 0), neck);
    const L = new THREE.Vector3(-w * .46, -.26, 0), R = new THREE.Vector3(w * .46, -.26, 0);
    seg.push(neck, L, neck, R, L, R);
    return new THREE.BufferGeometry().setFromPoints(seg);
  }

  items.forEach((p, i) => {
    const piv = new THREE.Group(); piv.rotation.order = 'YXZ';
    const m = new THREE.ShaderMaterial({ uniforms: { map: { value: blank }, uDim: { value: 0 }, uAsp: { value: .6 }, uTA: { value: .5625 }, uHi: { value: 0 } }, vertexShader: vs, fragmentShader: fs, side: THREE.DoubleSide, transparent: true });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(cfg.w, cfg.h), m);
    mesh.position.y = -cfg.h / 2 - .2; mesh.userData.i = i;
    piv.add(mesh);
    piv.add(new THREE.LineSegments(hangerGeo(cfg.w), lineMat));
    piv.userData = { a: (i / N) * Math.PI * 2, s: 0, sv: 0, mesh };
    root.add(piv); pivots.push(piv); mats.push(m);
    const src = '' + ((p.f && p.f[1]) || p.img);
    loader.load(src, tex => { m.uniforms.map.value = tex; m.uniforms.uTA.value = tex.image.width / tex.image.height; });
  });
  // the rail itself
  const railPts = []; for (let k = 0; k <= 160; k++) { const a = k / 160 * Math.PI * 2; railPts.push(new THREE.Vector3(Math.sin(a), 0, Math.cos(a))); }
  const rail = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(railPts), new THREE.LineBasicMaterial({ color: 0x6b6560 }));
  scene.add(rail);

  function applyLayout() {
    rail.scale.set(cfg.rx, 1, cfg.rz); rail.position.y = cfg.railY;
    cam.position.set(0, cfg.camY, cfg.camZ); cam.lookAt(0, cfg.look, 0);
    pivots.forEach(pv => { const m = pv.userData.mesh; m.geometry.dispose(); m.geometry = new THREE.PlaneGeometry(cfg.w, cfg.h); m.position.y = -cfg.h / 2 - .2; pv.children[1].geometry.dispose(); pv.children[1].geometry = hangerGeo(cfg.w); });
  }
  applyLayout();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w) return;
    const mobBefore = cfg.rx === cfg.rz; layout(); if ((cfg.rx === cfg.rz) !== mobBefore) applyLayout();
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    // keep the front look fully in frame on tall/narrow screens
    cam.position.z = cfg.camZ;
    cam.lookAt(0, cfg.look, 0);
  }
  resize(); addEventListener('resize', resize);

  // input: scroll progress + drag
  let drag = 0, dragT = 0, rot = 0, prevRot = 0, lastInput = performance.now();
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, d: dragT, moved: false, id: e.pointerId }; });
  addEventListener('pointermove', e => {
    if (!down || e.pointerId !== down.id) return;
    const dx = e.clientX - down.x;
    if (Math.abs(dx) > 6) down.moved = true;
    dragT = down.d + dx * (cfg.rx === cfg.rz ? .006 : .0045); lastInput = performance.now();
  }, { passive: true });
  addEventListener('pointerup', e => {
    if (!down) return; const d = down; down = null;
    if (d.moved) return;
    const r = canvas.getBoundingClientRect();
    const v = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    const ray = new THREE.Raycaster(); ray.setFromCamera(v, cam);
    const hit = ray.intersectObjects(pivots.map(p => p.userData.mesh))[0];
    if (hit) cb.onPick(hit.object.userData.i);
  });
  addEventListener('pointercancel', () => { down = null; });
  addEventListener('scroll', () => { lastInput = performance.now(); }, { passive: true });

  const progress = () => { const r = section.getBoundingClientRect(); const span = r.height - innerHeight; return span > 0 ? THREE.MathUtils.clamp(-r.top / span, 0, 1) : 0; };

  let visible = false, raf = 0, focus = -1, hoverI = -1;
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) start(); }, { rootMargin: '100px 0px' });
  io.observe(section);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) start(); });
  const clock = new THREE.Clock();
  function start() { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
  function tick() {
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();
    const scrollRot = -progress() * Math.PI * 2 * (N - 1) / N;
    // gentle snap to the nearest look when idle
    if (!down && performance.now() - lastInput > 700) {
      const total = scrollRot + dragT; const step = Math.PI * 2 / N;
      const snap = Math.round(total / step) * step; dragT += (snap - total) * .05;
    }
    drag += (dragT - drag) * .12;
    const target = scrollRot + drag;
    rot += (target - rot) * .1;
    const vel = rot - prevRot; prevRot = rot;
    let best = -1, bz = -9;
    pivots.forEach((pv, i) => {
      const u = pv.userData, a = u.a + rot;
      const x = Math.sin(a) * cfg.rx, z = Math.cos(a) * cfg.rz;
      pv.position.set(x, cfg.railY, z);
      pv.rotation.y = a;
      // hanger swing: spring towards a lag proportional to velocity
      const goal = THREE.MathUtils.clamp(-vel * 9, -.5, .5) + Math.sin(t * .9 + i) * .012;
      u.sv += (goal - u.s) * .06; u.sv *= .86; u.s += u.sv;
      pv.rotation.z = u.s; pv.rotation.x = u.s * .25;
      const depth = (z / cfg.rz + 1) / 2; // 0 back .. 1 front
      mats[i].uniforms.uDim.value = (1 - depth) * .55;
      mats[i].uniforms.uHi.value = i === focus ? 1 : 0;
      if (z > bz) { bz = z; best = i; }
    });
    if (best !== focus) { focus = best; cb.onFocus(best); }
    renderer.render(scene, cam);
    raf = requestAnimationFrame(tick);
  }
  start();
}
