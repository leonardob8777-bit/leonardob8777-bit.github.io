/* =================================================================
   AGUJERO NEGRO — WebGL + GLSL
   -----------------------------------------------------------------
   No usa librerías (ni Three.js): dibuja dos triángulos que cubren
   el lienzo y TODO el render lo hace el fragment shader.

   Cómo funciona el shader, en criollo:
     1. Por cada píxel se lanza un rayo desde la cámara.
     2. El rayo se integra paso a paso y en cada paso se CURVA hacia
        el agujero negro (aproximación de geodésica). Eso es la lente
        gravitacional de verdad: el disco de atrás se ve arqueado por
        encima y por debajo del horizonte.
     3. Si el rayo cruza el disco, se acumula emisión con turbulencia
        (ruido fbm) girando a velocidad kepleriana, color por
        temperatura y realce Doppler del lado que viene hacia vos.
     4. Si cae dentro del horizonte → negro absoluto.
     5. Si escapa → campo de estrellas (también lenteado).
     6. Al final: bloom barato + tone mapping para el brillo HDR.

   RENDIMIENTO (importante en iPhone):
     · Resolución limitada (ver DPR_MAX y CALIDAD).
     · Menos pasos de integración en móvil.
     · Se pausa si la pestaña no está visible o el lienzo sale de
       pantalla.
     · Si no hay WebGL o el usuario pidió menos animaciones, no se
       activa y queda la versión CSS de respaldo.
   ================================================================= */

(function () {
  "use strict";

  const lienzo = document.getElementById("bh-canvas");
  if (!lienzo) return;

  // Respeta a quien pidió menos movimiento: dejamos la versión CSS.
  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const gl =
    lienzo.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false }) ||
    lienzo.getContext("experimental-webgl", { alpha: true, antialias: false });

  if (!gl) return; // sin WebGL → queda el agujero negro de CSS

  const esMovil = window.matchMedia("(pointer: coarse)").matches;
  const DPR_MAX = esMovil ? 1.0 : 1.5;   // techo de resolución
  const PASOS = esMovil ? 110 : 190;      // pasos de integración del rayo

  /* ---------------- VERTEX: solo dibuja el rectángulo ------------- */
  const VS = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  /* ---------------- FRAGMENT: acá está todo ----------------------- */
  const FS = `
  precision highp float;

  uniform vec2  uRes;
  uniform float uTime;

  #define PASOS ${PASOS}

  // Radio del horizonte (unidades arbitrarias)
  const float RS       = 1.0;
  const float DISCO_IN = 2.6;   // borde interno del disco
  const float DISCO_EX = 11.0;  // borde externo
  const float GRUESO   = 0.42;  // semi-espesor del disco

  /* ---------- ruido ---------- */
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float ruido(vec3 x) {
    vec3 p = floor(x), f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(p + vec3(0.0,0.0,0.0)), hash(p + vec3(1.0,0.0,0.0)), f.x),
          mix(hash(p + vec3(0.0,1.0,0.0)), hash(p + vec3(1.0,1.0,0.0)), f.x), f.y),
      mix(mix(hash(p + vec3(0.0,0.0,1.0)), hash(p + vec3(1.0,0.0,1.0)), f.x),
          mix(hash(p + vec3(0.0,1.0,1.0)), hash(p + vec3(1.0,1.0,1.0)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * ruido(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  /* ---------- color por temperatura (frío→caliente) ---------- */
  vec3 colorTemp(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 rojo   = vec3(0.62, 0.10, 0.015);
    vec3 naranja= vec3(1.00, 0.42, 0.08);
    vec3 ambar  = vec3(1.00, 0.72, 0.32);
    vec3 blanco = vec3(1.00, 0.97, 0.90);
    vec3 c = mix(rojo, naranja, smoothstep(0.0, 0.35, t));
    c = mix(c, ambar,  smoothstep(0.35, 0.68, t));
    c = mix(c, blanco, smoothstep(0.68, 1.0,  t));
    return c;
  }

  /* ---------- campo de estrellas ---------- */
  vec3 estrellas(vec3 d) {
    vec3 col = vec3(0.0);
    vec3 p = d * 190.0;
    vec3 celda = floor(p);
    float h = hash(celda);
    if (h > 0.972) {
      vec3 centro = celda + vec3(hash(celda + 1.7), hash(celda + 3.1), hash(celda + 7.3));
      float dd = length(p - centro);
      float br = smoothstep(0.9, 0.0, dd) * (0.35 + 0.65 * hash(celda + 11.0));
      // leve titileo
      br *= 0.75 + 0.25 * sin(uTime * 2.0 + h * 40.0);
      vec3 tinte = mix(vec3(0.75, 0.85, 1.0), vec3(1.0, 0.92, 0.8), hash(celda + 5.5));
      col += tinte * br * 0.9;
    }
    // polvo galáctico muy tenue
    float neb = fbm(d * 3.4 + 12.0);
    col += vec3(0.055, 0.045, 0.075) * pow(max(neb - 0.45, 0.0), 2.0) * 2.2;
    return col;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);

    /* ---- Cámara: casi en el plano del disco, como en Interstellar ---- */
    float t = uTime * 0.06;
    float altura = 0.62 + 0.16 * sin(t * 0.7);         // deriva suave
    vec3  camPos = vec3(sin(t * 0.32) * 1.4, altura, -15.5);
    vec3  objetivo = vec3(0.0, 0.0, 0.0);

    vec3 f = normalize(objetivo - camPos);
    vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f));
    vec3 u = cross(f, r);
    vec3 dir = normalize(uv.x * r + uv.y * u + 1.45 * f);

    vec3 pos = camPos;
    vec3 color = vec3(0.0);
    float transp = 1.0;      // cuánta luz de fondo sigue pasando
    bool  tragado = false;

    // Momento angular al cuadrado: controla cuánto se curva el rayo
    vec3  h  = cross(pos, dir);
    float h2 = dot(h, h);

    float paso = 0.34;

    for (int i = 0; i < PASOS; i++) {
      float dist = length(pos);

      // Dentro del horizonte → no escapa nada
      if (dist < RS * 1.02) { tragado = true; break; }
      if (dist > 60.0 && dot(pos, dir) > 0.0) break; // ya se fue

      // Paso adaptativo: fino cerca del agujero, grueso lejos
      float dt = paso * clamp(dist * 0.22, 0.16, 1.5);

      // --- CURVATURA DE LA LUZ (geodésica aproximada) ---
      vec3 acel = -1.35 * h2 * pos / pow(dot(pos, pos), 2.5);
      dir = normalize(dir + acel * dt);

      vec3 sig = pos + dir * dt;

      // --- ¿Cruzó el disco? ---
      if (pos.y * sig.y < 0.0 || abs(pos.y) < GRUESO) {
        float rad = length(vec2(sig.x, sig.z));
        if (rad > DISCO_IN && rad < DISCO_EX) {
          // Perfil vertical (más denso en el centro del disco)
          float vert = exp(-abs(sig.y) * abs(sig.y) / (GRUESO * GRUESO) * 2.2);

          // Giro kepleriano: adentro gira mucho más rápido
          float ang = atan(sig.z, sig.x);
          float vel = 2.6 / pow(rad, 1.5);
          float giro = uTime * vel * 1.9;

          // Turbulencia en coordenadas que rotan con el gas
          vec2 q = vec2(cos(ang + giro), sin(ang + giro)) * rad;
          float n1 = fbm(vec3(q * 0.62, uTime * 0.05));
          float n2 = fbm(vec3(q * 1.9 + 4.0, uTime * 0.11));
          float turb = mix(n1, n2, 0.45);

          // Filamentos finos (las "vetas" del gas)
          float vetas = 0.55 + 0.45 * sin(rad * 5.5 - giro * 2.2 + turb * 7.0);

          // Densidad: cae hacia los bordes
          float dens = smoothstep(DISCO_IN, DISCO_IN + 1.5, rad)
                     * (1.0 - smoothstep(DISCO_EX * 0.55, DISCO_EX, rad));
          dens *= vert * (0.35 + 0.85 * turb) * vetas;

          // Temperatura: mucho más caliente cerca del horizonte
          float temp = pow(clamp(1.0 - (rad - DISCO_IN) / (DISCO_EX - DISCO_IN), 0.0, 1.0), 1.35);
          temp = temp * 0.85 + turb * 0.25;

          // --- DOPPLER: el lado que viene hacia la cámara brilla más ---
          vec3 velDir = normalize(cross(vec3(0.0, 1.0, 0.0), sig));
          float beta = clamp(dot(velDir, -dir), -1.0, 1.0) * (1.5 / sqrt(rad));
          float doppler = pow(clamp(1.0 + beta, 0.05, 3.0), 3.2);

          vec3 emis = colorTemp(temp) * dens * doppler * 2.6;

          color += emis * transp * dt * 1.15;
          transp *= max(0.0, 1.0 - dens * dt * 1.6);
        }
      }

      pos = sig;
      if (transp < 0.02) break;
    }

    // Fondo estrellado (solo lo que no fue absorbido)
    if (!tragado) color += estrellas(normalize(dir)) * transp;

    /* ---- ANILLO DE FOTONES: brillo blanco intensísimo en el borde ---- */
    // Se calcula por lo cerca que el rayo pasó de la órbita de fotones
    float impacto = length(cross(camPos, normalize(dir)));
    float anillo = exp(-pow(abs(impacto - RS * 2.62) * 9.5, 2.0));
    color += vec3(1.0, 0.93, 0.82) * anillo * 1.5;

    /* ---- Bloom barato: halo alrededor de lo muy brillante ---- */
    float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color += color * smoothstep(0.55, 2.4, lum) * 0.75;

    /* ---- Tone mapping (ACES aproximado) ---- */
    vec3 x = color * 0.85;
    color = clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);

    // Alfa: transparente donde no hay nada, para que se vea la página
    float alfa = clamp(dot(color, vec3(0.333)) * 3.4, 0.0, 1.0);
    gl_FragColor = vec4(color, alfa);
  }
  `;

  /* ---------------- compilación ---------------- */
  function compilar(tipo, fuente) {
    const s = gl.createShader(tipo);
    gl.shaderSource(s, fuente);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("Shader:", gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = compilar(gl.VERTEX_SHADER, VS);
  const fs = compilar(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return; // falla → queda el respaldo CSS

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("Link:", gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  // Rectángulo que cubre todo
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Ya llegamos hasta acá: WebGL funciona → escondemos la versión CSS
  document.body.classList.add("has-webgl-bh");

  /* ---------------- tamaño ---------------- */
  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
    const w = Math.max(1, Math.round(lienzo.clientWidth * dpr));
    const h = Math.max(1, Math.round(lienzo.clientHeight * dpr));
    if (lienzo.width !== w || lienzo.height !== h) {
      lienzo.width = w;
      lienzo.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  /* ---------------- bucle ---------------- */
  let visible = true;
  let corriendo = false;
  const inicio = performance.now();

  function cuadro() {
    if (!visible || document.hidden) { corriendo = false; return; }
    corriendo = true;
    redimensionar();
    gl.uniform2f(uRes, lienzo.width, lienzo.height);
    gl.uniform1f(uTime, (performance.now() - inicio) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(cuadro);
  }

  function arrancar() {
    if (!corriendo) requestAnimationFrame(cuadro);
  }

  // Un solo cuadro si el usuario pidió menos animaciones
  if (menosMovimiento) {
    redimensionar();
    gl.uniform2f(uRes, lienzo.width, lienzo.height);
    gl.uniform1f(uTime, 8.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return;
  }

  // Pausa cuando no se ve (ahorra batería en el celular)
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
      if (visible) arrancar();
    }).observe(lienzo);
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) arrancar(); });
  window.addEventListener("resize", redimensionar);

  arrancar();
})();
