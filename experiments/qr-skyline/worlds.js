(() => {
  'use strict';

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  const $ = (selector) => document.querySelector(selector);
  const shell = $('.scene-shell');
  let canvas = $('#canvas');
  const input = $('#urlInput');
  const status = $('#statusText');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const themes = {
    city: { label: '城市', name: '链接之城', number: '01 / CITY', sky: '#292724', ground: '#eee4d3', edge: '#a89070', dark: '#34343a', side: '#b99b79' },
    forest: { label: '树林', name: '一方青绿', number: '02 / FOREST', sky: '#202c28', ground: '#e7eddd', edge: '#8c9a79', dark: '#183d2e', side: '#4c7651' },
    mountain: { label: '山地', name: '山脊之间', number: '03 / HIGHLANDS', sky: '#272f2b', ground: '#e6e8d7', edge: '#83907d', dark: '#38493b', side: '#77836b' },
    snow: { label: '雪地', name: '雪线之上', number: '04 / SNOWFIELD', sky: '#253038', ground: '#f0f6f7', edge: '#9fb9c4', dark: '#314b59', side: '#b1c9d2' },
    desert: { label: '沙漠', name: '风留下的沙丘', number: '05 / DESERT', sky: '#392b23', ground: '#f5dfb2', edge: '#c59b68', dark: '#72442b', side: '#c8965e' },
    tower: { label: '塔楼', name: '微缩塔之国', number: '06 / TOWERS', sky: '#302625', ground: '#f0e5d7', edge: '#b1947c', dark: '#553529', side: '#c5a086' }
  };
  let theme = 'city';
  let qr = null, size = 29, url = '', seed = 0, maxHeight = 1;
  let renderer = null, scene = null, camera = null, mesh = null;
  let fallback = false, visible = true, parentPaused = false, contextLost = false;
  let width = 1, height = 1, pixelRatio = 1, raf = 0, orbit = false, lastFrame = 0;
  let elevation = 38, azimuth = .54, transition = null, gesture = null, suppressClickUntil = 0;
  let positions = [], colors = [];
  let geometryRevision = 0;
  let recoveryTimer = 0;
  const colorCache = new Map();
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;

  function hash(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    return h >>> 0;
  }

  function randomAt(x, z, salt = 0) {
    let h = seed ^ Math.imul(x + 101, 374761393) ^ Math.imul(z + 173, 668265263) ^ Math.imul(salt, 1274126177);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  function normalize(value) {
    const raw = value.trim();
    if (!raw) throw new Error('先输入一个网页链接。');
    const http = /^https?:\/\//i.test(raw);
    const hostPort = /^[^/?#\s]+:\d+(?:[/?#]|$)/.test(raw);
    if (!http && /^[a-z][a-z\d+.-]*:/i.test(raw) && !hostPort) throw new Error('请使用 http 或 https 网页链接。');
    let result;
    try { result = new URL(http ? raw : `https://${raw}`); }
    catch { throw new Error('这个链接无法识别，请检查格式。'); }
    if (!['http:', 'https:'].includes(result.protocol)) throw new Error('请使用 http 或 https 网页链接。');
    // Keep a real-time, manipulable mesh even for percent-encoded non-ASCII URLs.
    if (result.href.length > 1800) throw new Error('链接太长，试试页面的短链接。');
    return result.href;
  }

  function rgb(hex, shade = 1) {
    const key = `${hex}:${shade}`;
    if (!colorCache.has(key)) {
      const c = new THREE.Color(hex).multiplyScalar(shade);
      colorCache.set(key, [c.r, c.g, c.b]);
    }
    return colorCache.get(key);
  }

  function triangle(a, b, c, hex, shade = 1) {
    positions.push(...a, ...b, ...c);
    const color = rgb(hex, shade);
    colors.push(...color, ...color, ...color);
  }

  function quad(a, b, c, d, hex, shade = 1) {
    triangle(a, b, c, hex, shade);
    triangle(a, c, d, hex, shade);
  }

  function box(x, z, base, w, depth, h, topColor, sideColor) {
    const x0 = x - w / 2, x1 = x + w / 2, z0 = z - depth / 2, z1 = z + depth / 2, y = base + h;
    quad([x0,y,z0], [x0,y,z1], [x1,y,z1], [x1,y,z0], topColor);
    quad([x0,base,z1], [x1,base,z1], [x1,y,z1], [x0,y,z1], sideColor, .9);
    quad([x1,base,z0], [x0,base,z0], [x0,y,z0], [x1,y,z0], sideColor, .71);
    quad([x1,base,z1], [x1,base,z0], [x1,y,z0], [x1,y,z1], sideColor, .63);
    quad([x0,base,z0], [x0,base,z1], [x0,y,z1], [x0,y,z0], sideColor, 1.04);
    maxHeight = Math.max(maxHeight, y);
  }

  function pyramid(x, z, base, w, h, color) {
    const a=[x-w/2,base,z-w/2], b=[x+w/2,base,z-w/2], c=[x+w/2,base,z+w/2], d=[x-w/2,base,z+w/2], peak=[x,base+h,z];
    triangle(a,b,peak,color,.75); triangle(b,c,peak,color,.65);
    triangle(c,d,peak,color,1); triangle(d,a,peak,color,1.16);
    maxHeight = Math.max(maxHeight, base + h);
  }

  function cityCell(x, z, col, row) {
    const t = themes.city;
    const radius = Math.hypot(x / size, z / size);
    const centre = Math.exp(-radius * radius * 12);
    const h = .5 + (1 + centre * 5.5) * (.42 + randomAt(col,row) * .85) * (size / 29);
    box(x,z,0,1,1,h,t.dark,t.side);
    if (h > 3 && randomAt(col,row,2) > .4) box(x,z,h,.4,.4,.4,t.dark,'#7d7b74');
    // Windows live on vertical faces, so their projection vanishes from above.
    for (let y = .4; size <= 49 && y < h-.25; y += Math.max(.64, h/6)) {
      for (const u of [-.26,.12]) {
        const color = randomAt(col,row,Math.round(y*10)+Math.round(u*10)) > .25 ? '#f2d4a1' : '#665b50';
        quad([x+u,y,z+.5001],[x+u+.14,y,z+.5001],[x+u+.14,y+.18,z+.5001],[x+u,y+.18,z+.5001],color);
        quad([x+.5001,y,z+u],[x+.5001,y+.18,z+u],[x+.5001,y+.18,z+u+.14],[x+.5001,y,z+u+.14],color,.76);
      }
    }
  }

  function forestCell(x,z,col,row) {
    const h = (1.7 + randomAt(col,row)*2.8 + Math.exp(-(x*x+z*z)/(size*size*.14))*1.5) * (size/29);
    box(x,z,0,.22,.22,h*.48,'#263b29','#80624a');
    pyramid(x,z,h*.22,1,h*.62,'#214f37');
    pyramid(x,z,h*.45,.78,h*.50,'#193e2c');
    pyramid(x,z,h*.68,.48,h*.36,'#29533a');
  }

  function towerCell(x,z,col,row) {
    const radial = Math.exp(-(x*x+z*z)/(size*size*.13));
    const levels = Math.min(size > 65 ? 3 : 6, 1 + Math.floor(radial * 4 + randomAt(col,row)*2));
    const step = .58 * (size/29);
    box(x,z,0,1,1,.22,themes.tower.dark,'#bc9272');
    for (let i=0; i<levels; i++) {
      const w=1-i/(levels+2)*.55;
      const y=.22+i*step;
      box(x,z,y,w*.65,w*.65,step,'#573f32','#cba78a');
      pyramid(x,z,y+step*.74,w,step*.43, i%2 ? '#4c3329' : '#69402d');
    }
    pyramid(x,z,.22+levels*step,.3,.8*radial+.2,'#493029');
  }

  function terrainHeight(x,z) {
    const u=x/size, v=z/size;
    const boundary = Math.sin(Math.PI*clamp(u+.5,0,1)) * Math.sin(Math.PI*clamp(v+.5,0,1));
    const phase=(seed%1000)/159;
    if (theme==='desert') {
      const dunes=.55+.45*Math.sin(u*15+v*9+phase);
      return Math.max(0,boundary) * size * (.035 + .14*dunes);
    }
    let peaks=0;
    for(let i=0;i<3;i++) {
      const px=(randomAt(i,71)-.5)*.55, pz=(randomAt(i,72)-.5)*.55;
      const distance=((u-px)**2+(v-pz)**2);
      peaks+=Math.exp(-distance*(24+i*12))*(.1+i*.035);
    }
    const ridges=.91+.09*Math.sin(u*32+v*17+phase);
    const h=boundary*size*(.018+peaks*ridges);
    return theme==='snow' ? h*1.2 : h;
  }

  function terrainCell(x,z,dark) {
    const t=themes[theme], x0=x-.5, x1=x+.5, z0=z-.5, z1=z+.5;
    const a=[x0,terrainHeight(x0,z0),z0], b=[x1,terrainHeight(x1,z0),z0], c=[x1,terrainHeight(x1,z1),z1], d=[x0,terrainHeight(x0,z1),z1];
    // Shared corner heights create a continuous landscape. Every tile's full
    // horizontal footprint retains its QR polarity, regardless of its slope.
    const topColor=dark?t.dark:t.ground;
    triangle(a,d,b,topColor,1); triangle(b,d,c,topColor,.94);
    quad([x0,0,z0],a,b,[x1,0,z0],t.side,.75);
    quad([x1,0,z1],c,d,[x0,0,z1],t.side,.9);
    quad([x1,0,z0],b,c,[x1,0,z1],t.side,.63);
    quad([x0,0,z1],d,a,[x0,0,z0],t.side,1);
    maxHeight=Math.max(maxHeight,a[1],b[1],c[1],d[1]);
  }

  function buildMesh() {
    if (fallback || !qr) return;
    positions=[]; colors=[]; maxHeight=0;
    const t=themes[theme], extent=size+8;
    box(0,0,-.85,extent,extent,.85,t.ground,t.edge);
    const terrain=['mountain','snow','desert'].includes(theme);
    for(let row=0;row<size;row++) for(let col=0;col<size;col++) {
      const dark=qr.isDark(row,col), x=col-(size-1)/2, z=row-(size-1)/2;
      if (terrain) terrainCell(x,z,dark);
      else if (dark) {
        if(theme==='city') cityCell(x,z,col,row);
        if(theme==='forest') forestCell(x,z,col,row);
        if(theme==='tower') towerCell(x,z,col,row);
      }
    }
    if(mesh) { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    geometry.computeBoundingSphere();
    mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,toneMapped:false}));
    scene.add(mesh);
    geometryRevision++;
    positions=[]; colors=[];
  }

  function generate(raw) {
    let next, nextQr;
    try {
      next=normalize(raw); nextQr=qrcode(0,'M'); nextQr.addData(next,'Byte'); nextQr.make();
    } catch(error) {
      status.textContent=error instanceof Error?error.message:'链接太长，试试页面的短链接。';
      input.setAttribute('aria-invalid','true'); return false;
    }
    qr=nextQr; size=qr.getModuleCount(); url=next; seed=hash(url); input.value=url; input.removeAttribute('aria-invalid');
    buildMesh();
    setView(false,true);
    status.textContent=fallback?'浏览器无法显示 3D，已保留可扫描二维码。':'风景已生成。试着从正上方看看。';
    schedule(); return true;
  }

  function setTheme(next) {
    if(!themes[next]) return;
    theme=next;
    document.documentElement.style.setProperty('--scene',themes[next].sky);
    $('#sceneName').textContent=themes[next].name;
    $('#sceneNumber').textContent=themes[next].number;
    document.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===next)));
    buildMesh(); setView(false);
    status.textContent=`已切换${themes[next].label}。拖动观察，或点击“俯视扫码”。`;
    schedule();
  }

  function syncControls() {
    const topView=elevation>=89.999;
    shell.classList.toggle('is-top',topView || transition?.target===90);
    $('#topBtn').setAttribute('aria-pressed',String(topView || transition?.target===90));
    $('#sceneBtn').setAttribute('aria-pressed',String(!topView && transition?.target!==90));
    $('#angleInput').value=String(Math.round(elevation));
    $('#angleValue').value=`${Math.round(elevation)}°`;
    $('#orbitBtn').setAttribute('aria-pressed',String(orbit));
    canvas.setAttribute('aria-label',fallback?'可扫描的标准二维码':topView?'俯视二维码，点击或按 Enter 返回风景':`拖动旋转${themes[theme].label}，点击或按 Enter 转为俯视二维码`);
  }

  function setView(topView,instant=false) {
    orbit=false;
    if(fallback) topView=true;
    const target=topView?90:38;
    const targetAz=topView?0:.54;
    if(instant || reduced.matches || fallback) {
      elevation=target; azimuth=targetAz; transition=null;
      status.textContent=topView?'正上方就是二维码，可以扫码打开链接。':'拖动旋转 · 点击俯视';
    } else {
      // The mesh, all colors and the QR remain immutable throughout this move.
      const shortestAz=targetAz+Math.atan2(Math.sin(azimuth-targetAz),Math.cos(azimuth-targetAz));
      transition={start:performance.now(),duration:1350,from:elevation,azFrom:shortestAz,target,azTarget:targetAz};
      status.textContent=topView?'镜头正在转向正上方……':'镜头正在回到风景……';
    }
    syncControls(); schedule();
  }

  function updateCamera() {
    const nearTop=clamp((elevation-60)/30,0,1);
    const aimY=maxHeight*.20*(1-nearTop);
    const radians=elevation*Math.PI/180, distance=(size+maxHeight)*3;
    const topView=elevation>=89.999;
    camera.up.set(0,topView?0:1,topView?-1:0);
    camera.position.set(topView?0:Math.sin(azimuth)*Math.cos(radians)*distance, aimY+Math.sin(radians)*distance, topView?0:Math.cos(azimuth)*Math.cos(radians)*distance);
    camera.lookAt(0,aimY,0); camera.updateMatrixWorld();
    const half=(size+8)/2;
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    for(const x of [-half,half]) for(const y of [-.85,maxHeight]) for(const z of [-half,half]) {
      const point=new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);
      minX=Math.min(minX,point.x); maxX=Math.max(maxX,point.x); minY=Math.min(minY,point.y); maxY=Math.max(maxY,point.y);
    }
    const aspect=canvas.width/canvas.height;
    let span=Math.max((maxY-minY)/.84,(maxX-minX)/(aspect*.87));
    const pixelsPerCell=Math.max(1,Math.floor(Math.min(canvas.width,canvas.height)*.86/(size+8)));
    const scanSpan=canvas.height/pixelsPerCell;
    const topBlend=ease(clamp((elevation-75)/15,0,1));
    // Ease into integer-pixel framing, avoiding a size jump on the last frame.
    span=mix(span,scanSpan,topBlend);
    // An odd QR footprint on an even canvas would otherwise land on half pixels.
    // Align both its size AND origin to physical pixels, including at 1 px/module.
    const qrPixels=(size+8)*pixelsPerCell;
    const left=(canvas.width-qrPixels)/2, top=(canvas.height-qrPixels)/2;
    const cx=(left-Math.floor(left))/pixelsPerCell*topBlend;
    const cy=-(top-Math.floor(top))/pixelsPerCell*topBlend;
    camera.left=-span*aspect/2+cx; camera.right=span*aspect/2+cx; camera.top=span/2+cy; camera.bottom=-span/2+cy;
    camera.near=.1; camera.far=distance*6; camera.updateProjectionMatrix();
  }

  function drawFallback() {
    if(!qr) return;
    const ctx=canvas.getContext('2d');
    if(!ctx) return;
    canvas.width=Math.round(width*pixelRatio); canvas.height=Math.round(height*pixelRatio);
    ctx.fillStyle=themes[theme].sky; ctx.fillRect(0,0,canvas.width,canvas.height);
    const cell=Math.max(1,Math.floor(Math.min(canvas.width,canvas.height)*.86/(size+8)));
    const total=cell*(size+8), x=Math.floor((canvas.width-total)/2), y=Math.floor((canvas.height-total)/2);
    ctx.fillStyle='#fff'; ctx.fillRect(x,y,total,total); ctx.fillStyle='#000';
    for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(qr.isDark(r,c)) ctx.fillRect(x+(c+4)*cell,y+(r+4)*cell,cell,cell);
  }

  function render() {
    if(!qr || contextLost) return;
    if(fallback) drawFallback();
    else { updateCamera(); renderer.render(scene,camera); }
    window.__ready=true;
  }

  function active() { return visible && !document.hidden && !parentPaused && !contextLost; }
  function schedule() { if(!raf && active()) raf=requestAnimationFrame(frame); }
  function frame(now) {
    raf=0;
    if(!active()) return;
    const dt=Math.min(50,now-(lastFrame||now)); lastFrame=now;
    if(transition) {
      const t=clamp((now-transition.start)/transition.duration,0,1), p=ease(t);
      elevation=mix(transition.from,transition.target,p); azimuth=mix(transition.azFrom,transition.azTarget,p);
      if(t===1) {
        elevation=transition.target; azimuth=transition.azTarget; transition=null;
        status.textContent=elevation===90?'正上方就是二维码，可以扫码打开链接。':'拖动旋转 · 点击俯视';
      }
      syncControls();
    } else if(orbit && !reduced.matches) azimuth+=dt*.00012;
    render();
    if(transition || (orbit && !reduced.matches)) schedule();
  }

  function resize() {
    width=Math.max(1,shell.clientWidth); height=Math.max(1,shell.clientHeight);
    pixelRatio=Math.min(devicePixelRatio||1,2,Math.sqrt(3500000/(width*height)));
    if(renderer) { renderer.setPixelRatio(pixelRatio); renderer.setSize(width,height,false); }
    schedule();
  }

  function enableFallback() {
    if(fallback) return;
    clearTimeout(recoveryTimer);
    fallback=true; contextLost=false;
    mesh?.geometry.dispose(); mesh?.material.dispose(); renderer?.dispose();
    renderer=null; mesh=null;
    const replacement=canvas.cloneNode(); canvas.replaceWith(replacement); canvas=replacement;
    canvas.setAttribute('role','img'); canvas.removeAttribute('tabindex'); canvas.removeAttribute('aria-describedby');
    $('#sceneBtn').disabled=true; $('#topBtn').disabled=true; $('#angleInput').disabled=true; $('#orbitBtn').disabled=true;
    document.querySelectorAll('[data-theme]').forEach(b=>{ b.disabled=true; });
    setView(true,true);
    status.textContent='浏览器无法显示 3D，已保留可扫描二维码。';
  }

  try {
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000,0);
    scene=new THREE.Scene(); camera=new THREE.OrthographicCamera();
  } catch(error) {
    enableFallback();
  }

  $('#generatorForm').addEventListener('submit',event=>{event.preventDefault();generate(input.value);});
  document.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.theme)));
  $('#sceneBtn').addEventListener('click',()=>setView(false));
  $('#topBtn').addEventListener('click',()=>setView(true));
  $('#angleInput').addEventListener('input',event=>{
    transition=null; orbit=false; elevation=Number(event.target.value);
    if(elevation===90) azimuth=0;
    else if(azimuth===0) azimuth=.54;
    status.textContent=elevation===90?'正上方就是二维码，可以扫码打开链接。':'拖动旋转 · 点击俯视';
    syncControls(); schedule();
  });
  $('#orbitBtn').addEventListener('click',()=>{
    if(reduced.matches) { status.textContent='已遵循系统的减少动态效果设置，可以拖动观察。'; return; }
    const next=!orbit;
    if(elevation>80) { elevation=38; azimuth=.54; }
    transition=null; orbit=next; syncControls(); schedule();
  });
  canvas.addEventListener('pointerdown',event=>{
    if(fallback || (event.button!==0 && event.pointerType==='mouse')) return;
    orbit=false; transition=null;
    gesture={id:event.pointerId,x:event.clientX,y:event.clientY,az:azimuth,el:elevation,moved:false};
    canvas.setPointerCapture(event.pointerId); syncControls();
  });
  canvas.addEventListener('pointermove',event=>{
    if(!gesture || gesture.id!==event.pointerId) return;
    const dx=event.clientX-gesture.x, dy=event.clientY-gesture.y;
    if(Math.hypot(dx,dy)>5) gesture.moved=true;
    if(!gesture.moved) return;
    azimuth=gesture.az-dx*.008; elevation=clamp(gesture.el+dy*.16,25,85);
    syncControls(); schedule();
  });
  canvas.addEventListener('pointerup',event=>{
    if(!gesture || gesture.id!==event.pointerId) return;
    if(gesture.moved) suppressClickUntil=performance.now()+250;
    gesture=null;
    if(canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointercancel',()=>{gesture=null;suppressClickUntil=performance.now()+250;});
  canvas.addEventListener('click',()=>{if(performance.now()>=suppressClickUntil&&!fallback)setView(elevation<89);});
  canvas.addEventListener('keydown',event=>{
    if(fallback) return;
    if(event.key==='Enter'||event.key===' ') {event.preventDefault();setView(elevation<89);}
    if(event.key==='Escape') setView(false);
  });
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault(); contextLost=true;
    status.textContent='3D 画面暂时中断，正在等待浏览器恢复。';
    recoveryTimer=setTimeout(enableFallback,4000);
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    if(fallback) return;
    clearTimeout(recoveryTimer); contextLost=false; schedule();
    status.textContent='3D 画面已恢复。';
  });
  new ResizeObserver(resize).observe(shell);
  new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible)schedule();},{threshold:.01}).observe(shell);
  document.addEventListener('visibilitychange',()=>schedule());
  addEventListener('message',event=>{
    if(event.source!==parent || event.origin!==location.origin || event.data?.type!=='xiahua:visibility') return;
    parentPaused=event.data.visible===false; if(!parentPaused)schedule();
  });
  reduced.addEventListener('change',()=>{orbit=false;if(transition)setView(transition.target===90,true);syncControls();schedule();});

  // Read-only geometry diagnostics support verifying that view changes never
  // rebuild, move, recolor or swap the landscape for a separate flat QR layer.
  window.qrWorld={
    get state(){return{theme,url,size,elevation,azimuth,geometryRevision,vertices:mesh?.geometry.attributes.position.count||0,animating:!!transition,orbit,fallback,paused:!active()};},
    get geometry(){return mesh?.geometry;},
    setTheme,
    setView,
    render,
    get matrix(){return Array.from({length:size},(_,r)=>Array.from({length:size},(_,c)=>qr.isDark(r,c)));}
  };
  resize(); generate(input.value);
  if(location.hash==='#qr') setView(true,true);
})();
