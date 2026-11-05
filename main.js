(function () {
  'use strict';
  // Menú: se convierte en píldora al bajar
  var nav = document.querySelector('.navbar');
  var onScroll = function () {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (nav) { nav.classList.toggle('is-scrolled', y > 60); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Preguntas frecuentes: una abierta a la vez
  var items = Array.prototype.slice.call(document.querySelectorAll('.fq'));
  items.forEach(function (it) {
    var btn = it.querySelector('.fqb');
    var ans = it.querySelector('.fqa');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      items.forEach(function (o) {
        o.classList.remove('op');
        o.querySelector('.fqb').setAttribute('aria-expanded', 'false');
        o.querySelector('.fqa').hidden = true;
      });
      if (!open) { it.classList.add('op'); btn.setAttribute('aria-expanded', 'true'); ans.hidden = false; }
    });
  });

  // Formulario: arma el mensaje y lo abre en WhatsApp
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var txt = 'Hola Alex, soy ' + (v('nombre') || '(nombre)') +
        (v('negocio') ? ' de ' + v('negocio') : '') + '. ' +
        (v('mensaje') || 'Me interesa una página web.') +
        (v('whatsapp') ? ' Mi WhatsApp: ' + v('whatsapp') : '');
      var url = 'https://wa.me/524443180169?text=' + encodeURIComponent(txt);
      var sent = form.querySelector('.sent'); var fields = form.querySelector('.fields');
      if (sent) {
        sent.textContent = 'Tu mensaje está listo. ';
        var a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
        a.className = 'pill pill-amber'; a.textContent = 'Enviarlo por WhatsApp'; a.style.marginLeft = '12px';
        sent.appendChild(a); sent.hidden = false;
      }
      if (fields) { fields.style.display = 'none'; }
    });
  }

  // Efectos ligados al scroll
  var self = {};
    var scEls = [];
    var collect = function () { scEls = Array.prototype.slice.call(document.querySelectorAll('[data-sc]')); };
    var reduceM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking = false;
    var paint = function () {
      ticking = false;
      if (!scEls.length) { collect(); }
      var vh = window.innerHeight || 800;
      for (var i = 0; i < scEls.length; i++) {
        var el = scEls[i];
        var ab = (el.getAttribute('data-sc') || '0.9,0.4').split(',');
        var a = parseFloat(ab[0]), b = parseFloat(ab[1]);
        var top = el.getBoundingClientRect().top;
        var p = reduceM ? 1 : (vh * a - top) / (vh * (a - b));
        p = p < 0 ? 0 : (p > 1 ? 1 : p);
        el.style.setProperty('--p', p.toFixed(4));
      }
    };
    window.__fx = function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    window.addEventListener('scroll', window.__fx, { passive: true });
    window.addEventListener('resize', window.__fx);
    var fxTries = 0;
    var fxBoot = function () { collect(); if (!scEls.length && fxTries++ < 40) { requestAnimationFrame(fxBoot); return; } paint(); };
    fxBoot();


  // Brillo vivo del borde del arco (WebGL)
function atlasFlares(cv, host) {
  var gl = cv.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' });
  if (!gl) { return null; }
  var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs = [
    'precision highp float;',
    'uniform vec2 res;uniform vec2 off;uniform float pw;uniform float t;uniform float k;',
    'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);',
    ' return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);',
    ' for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}',
    'void main(){',
    ' vec2 p=vec2(gl_FragCoord.x,(res.y*k)-gl_FragCoord.y)/k+off;',
    ' vec2 C=vec2(pw*.58,1570.);float R=1402.;',
    ' vec2 v=p-C;float d=length(v)-R;float a=atan(v.x,-v.y);float u=a*R;',
    ' if(d<-40.||d>300.){gl_FragColor=vec4(0.,0.,0.,1.);return;}',
    ' float cor=exp(-max(d,0.)/22.)*smoothstep(-30.,0.,d);',
    ' float rc=fbm(vec2(u*.045,d*.010-t*.45));rc=1.-abs(rc*2.-1.);rc=pow(rc,8.);',
    ' float I=cor*(.05+.95*rc)*.16;',
    ' for(int i=0;i<0;i++){',
    '  float fi=float(i);',
    '  float ac=fi==0.?-.33:(fi==1.?.10:.36);',
    '  float per=11.+fi*3.1;',
    '  float ph=fract((t+fi*4.7)/per);',
    '  float life=smoothstep(0.,.22,ph)*(1.-smoothstep(.72,1.,ph));',
    '  float du=(a-ac)*R;',
    '  float wav=sin(d*.018-t*.9+fi*2.)*14.*smoothstep(0.,120.,d);',
    '  du+=wav;',
    '  float h=(48.+fi*14.)*(.45+.55*smoothstep(0.,.5,ph));',
    '  float wdt=34.+fi*8.;',
    '  float env=exp(-du*du/(2.*wdt*wdt))*exp(-max(d,0.)/h)*smoothstep(-10.,4.,d);',
    '  vec2 np=vec2(du*.040,d*.010-t*.50-fi*9.);',
    '  vec2 w=vec2(fbm(np*.7+vec2(0.,t*.10)),fbm(np*.7+vec2(4.1,1.7)));',
    '  float f=fbm(np+w*1.3);',
    '  float rid=1.-abs(f*2.-1.);rid=pow(rid,7.);',
    '  float core=exp(-max(d,0.)/16.)*smoothstep(-24.,0.,d)*exp(-du*du/(2.*26.*26.));',
    '  I+=life*(env*(.12+rid*1.7)+core*.32);',
    ' }',
    ' vec3 col=mix(vec3(.55,.20,.02),vec3(1.,.42,.12),smoothstep(.04,.40,I));',
    ' col=mix(col,vec3(1.,.80,.52),smoothstep(.40,.95,I));',
    ' col=mix(col,vec3(1.,.97,.90),smoothstep(1.05,1.6,I));',
    ' gl_FragColor=vec4(col*clamp(I,0.,1.3),1.);',
    '}'
  ].join('\n');
  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { return null; } return s; }
  var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) { return null; }
  var pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { return null; }
  gl.useProgram(pr);
  var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uPw = gl.getUniformLocation(pr, 'pw'), uOff = gl.getUniformLocation(pr, 'off'), uRes = gl.getUniformLocation(pr, 'res'), uT = gl.getUniformLocation(pr, 't'), uK = gl.getUniformLocation(pr, 'k');
  var K = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
  var raf = 0, visible = true, t0 = performance.now(), dead = false;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    var w = cv.clientWidth, h = cv.clientHeight;
    var W = Math.max(1, Math.round(w * K)), H = Math.max(1, Math.round(h * K));
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; gl.viewport(0, 0, W, H); }
    gl.uniform2f(uRes, w, h); gl.uniform1f(uK, K);
    var par = cv.parentNode;
    gl.uniform2f(uOff, cv.offsetLeft, cv.offsetTop);
    gl.uniform1f(uPw, par ? par.clientWidth : w);
  }
  function draw(now) {
    if (dead) { return; }
    size();
    gl.uniform1f(uT, reduce ? 6.0 : (now - t0) / 1000 + 2.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduce && visible) { raf = requestAnimationFrame(draw); }
  }
  var io = null;
  if (window.IntersectionObserver && host) {
    io = new IntersectionObserver(function (es) {
      var vis = es[0].isIntersecting;
      if (vis && !visible) { visible = true; raf = requestAnimationFrame(draw); }
      visible = vis;
    });
    io.observe(host);
  }
  raf = requestAnimationFrame(draw);
  return function stop() { dead = true; cancelAnimationFrame(raf); if (io) { io.disconnect(); } };
}

  var cv = document.querySelector('canvas.flares');
  if (cv) { atlasFlares(cv, document.querySelector('.hero')); }
})();
