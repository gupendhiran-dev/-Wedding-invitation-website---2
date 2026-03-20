/* =============================================
   WEDDING INVITE — PARTICLES.JS
   Three.js particle + canvas systems
   ============================================= */

// ─── Hero Canvas (2D fallback particles) ─────
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const count = window.innerWidth < 768 ? 40 : 80;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = 0.5 + Math.random() * 2.5;
      this.speedY = -0.3 - Math.random() * 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = 0;
      this.maxOpacity = 0.3 + Math.random() * 0.5;
      this.life = 0;
      this.maxLife = 150 + Math.random() * 200;
      this.hue = 35 + Math.random() * 25; // gold-ish
    }
    update() {
      this.life++;
      this.x += this.speedX;
      this.y += this.speedY;

      // Fade in/out
      if (this.life < 30) {
        this.opacity = (this.life / 30) * this.maxOpacity;
      } else if (this.life > this.maxLife - 30) {
        this.opacity = ((this.maxLife - this.life) / 30) * this.maxOpacity;
      } else {
        this.opacity = this.maxOpacity;
      }

      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      // Glow effect
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
      gradient.addColorStop(0, `hsla(${this.hue}, 80%, 85%, 1)`);
      gradient.addColorStop(0.4, `hsla(${this.hue}, 70%, 75%, 0.6)`);
      gradient.addColorStop(1, `hsla(${this.hue}, 60%, 70%, 0)`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 95%, 1)`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.life = Math.random() * p.maxLife; // stagger initial lives
    particles.push(p);
  }

  // Shooting star occasionally
  let shootingStars = [];
  class ShootingStar {
    constructor() {
      this.x = Math.random() * canvas.width * 0.7;
      this.y = Math.random() * canvas.height * 0.4;
      this.len = 80 + Math.random() * 120;
      this.speed = 8 + Math.random() * 6;
      this.opacity = 1;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
      this.dx = Math.cos(this.angle) * this.speed;
      this.dy = Math.sin(this.angle) * this.speed;
      this.life = 0;
      this.maxLife = 40;
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      this.life++;
      this.opacity = 1 - this.life / this.maxLife;
      return this.life < this.maxLife;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * 0.8;
      const grad = ctx.createLinearGradient(
        this.x - this.dx * 8, this.y - this.dy * 8,
        this.x, this.y
      );
      grad.addColorStop(0, 'rgba(255, 240, 200, 0)');
      grad.addColorStop(1, 'rgba(255, 240, 200, 0.9)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x - this.dx * 8, this.y - this.dy * 8);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  setInterval(() => {
    if (Math.random() < 0.4) {
      shootingStars.push(new ShootingStar());
    }
  }, 3000);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => { p.update(); p.draw(); });
    
    shootingStars = shootingStars.filter(s => {
      s.draw();
      return s.update();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

// ─── Three.js Particle System (Thank You) ────
function initThreeParticles() {
  if (typeof THREE === 'undefined') {
    initFallbackParticles();
    return;
  }

  const canvas = document.getElementById('thankyou-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 5;

  // Particle geometry
  const pCount = window.innerWidth < 768 ? 300 : 600;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(pCount * 3);
  const colors = new Float32Array(pCount * 3);
  const sizes = new Float32Array(pCount);

  const colorOptions = [
    new THREE.Color(0xe8c97a), // gold
    new THREE.Color(0xf2c4ce), // blush
    new THREE.Color(0xffffff), // white
    new THREE.Color(0xe8d5b7), // champagne
  ];

  for (let i = 0; i < pCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

    const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.02 + Math.random() * 0.06;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Shader material for glowing particles
  const material = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize
  function onResize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    renderer.setSize(parent.offsetWidth, parent.offsetHeight);
    camera.aspect = parent.offsetWidth / parent.offsetHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    // Gentle rotation
    particles.rotation.y = time * 0.08 + mouseX * 0.15;
    particles.rotation.x = Math.sin(time * 0.05) * 0.1 + mouseY * 0.08;

    // Float up particles slightly
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      pos[i * 3 + 1] += 0.003;
      if (pos[i * 3 + 1] > 5) {
        pos[i * 3 + 1] = -5;
      }
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();
}

// ─── Fallback Canvas Particles (Thank You) ───
function initFallbackParticles() {
  const canvas = document.getElementById('thankyou-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const emojis = ['✨', '🌸', '💛', '⭐', '🌟', '💕'];

  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      size: 12 + Math.random() * 16,
      speed: 0.3 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.4,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();

      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -30) {
        p.y = canvas.height + 20;
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── SVG Background Mountains ────────────────
function injectSVGBackgrounds() {
  // Mountains SVG for hero
  const mountains = document.querySelector('.layer-mountains');
  if (mountains) {
    mountains.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 500" preserveAspectRatio="none" 
           style="position:absolute;bottom:0;left:0;width:100%;height:100%;">
        <defs>
          <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3d1555" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#1a0a2e" stop-opacity="1"/>
          </linearGradient>
          <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5c2080" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#2d1050" stop-opacity="0.9"/>
          </linearGradient>
          <linearGradient id="mtn3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8a4a9e" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#3a1560" stop-opacity="0.7"/>
          </linearGradient>
        </defs>
        <!-- Far mountains -->
        <path d="M0,500 L0,280 Q180,100 360,200 Q540,300 720,150 Q900,0 1080,180 Q1260,360 1440,200 L1440,500 Z" fill="url(#mtn3)"/>
        <!-- Mid mountains -->
        <path d="M0,500 L0,350 Q160,200 320,280 Q480,360 640,220 Q800,80 960,260 Q1120,440 1280,300 Q1380,220 1440,280 L1440,500 Z" fill="url(#mtn2)"/>
        <!-- Near mountains -->
        <path d="M0,500 L0,420 Q120,320 240,370 Q360,420 480,330 Q600,240 720,340 Q840,440 960,360 Q1080,280 1200,360 Q1320,440 1440,390 L1440,500 Z" fill="url(#mtn1)"/>
      </svg>`;
    mountains.style.background = 'none';
  }

  // Trees SVG
  const trees = document.querySelector('.layer-trees');
  if (trees) {
    trees.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400" preserveAspectRatio="none"
           style="position:absolute;bottom:0;left:0;width:100%;height:100%;">
        <defs>
          <linearGradient id="tree1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2a0e40" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#0f0520" stop-opacity="1"/>
          </linearGradient>
        </defs>
        <!-- Tree silhouettes -->
        <path d="M0,400 L0,300 
          Q20,280 40,260 Q50,240 60,260 Q70,280 80,260 Q95,230 110,255 Q120,270 130,255 Q145,225 160,250
          Q170,265 180,245 Q200,210 220,245 Q230,260 240,240 Q255,215 275,240
          Q290,260 310,238 Q325,220 345,242 Q360,258 375,238 Q390,218 410,245
          Q425,262 440,240 Q458,215 478,242 Q490,258 505,235 Q525,205 548,240
          Q565,265 585,240 Q605,215 625,245 Q640,262 658,240 Q678,215 700,242
          Q715,260 730,238 Q750,210 772,242 Q785,260 800,238 Q820,210 845,245
          Q860,265 878,242 Q895,220 915,248 Q930,265 948,242 Q968,215 990,248
          Q1005,265 1022,242 Q1042,215 1065,248 Q1082,265 1100,242 Q1118,220 1138,248
          Q1155,265 1175,242 Q1195,215 1218,248 Q1235,265 1252,242 Q1272,215 1295,248
          Q1310,262 1325,245 Q1345,222 1368,248 Q1383,265 1400,245 Q1420,222 1440,248
          L1440,400 Z" fill="url(#tree1)"/>
        <!-- Foreground bushes -->
        <path d="M0,400 L0,370 
          Q80,345 160,360 Q240,375 320,355 Q400,335 480,360 
          Q560,385 640,365 Q720,345 800,368 
          Q880,391 960,370 Q1040,349 1120,372 
          Q1200,395 1280,372 Q1360,349 1440,370 L1440,400 Z" fill="#0f0520" opacity="0.95"/>
      </svg>`;
    trees.style.background = 'none';
  }

  // Flora
  const flora = document.querySelector('.layer-flora');
  if (flora) {
    flora.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 300" preserveAspectRatio="none"
           style="position:absolute;bottom:0;left:0;width:100%;height:100%;">
        <path d="M0,300 L0,240 
          Q60,210 120,230 Q180,250 240,225 Q300,200 360,228 
          Q420,256 480,232 Q540,208 600,235 Q660,262 720,238 
          Q780,214 840,242 Q900,270 960,245 Q1020,220 1080,248 
          Q1140,276 1200,250 Q1260,224 1320,252 Q1380,280 1440,255 L1440,300 Z" 
          fill="#07021a" opacity="1"/>
        <path d="M0,300 L0,270 Q100,250 200,265 Q300,280 400,262 Q500,244 600,268 
          Q700,292 800,272 Q900,252 1000,278 Q1100,304 1200,280 Q1300,256 1440,275 L1440,300 Z" 
          fill="#040112" opacity="1"/>
      </svg>`;
    flora.style.background = 'none';
  }
}

// ─── Stars layer ─────────────────────────────
function injectStarsLayer() {
  const starsLayer = document.querySelector('.layer-stars');
  if (!starsLayer) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('viewBox', '0 0 1440 900');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

  let starsHTML = '';
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 1440;
    const y = Math.random() * 600;
    const r = 0.5 + Math.random() * 2;
    const opacity = 0.3 + Math.random() * 0.7;
    const dur = 2 + Math.random() * 4;
    starsHTML += `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${opacity}">
      <animate attributeName="opacity" values="${opacity};${opacity * 0.2};${opacity}" dur="${dur}s" repeatCount="indefinite"/>
    </circle>`;
  }
  svg.innerHTML = starsHTML;
  starsLayer.appendChild(svg);
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectSVGBackgrounds();
  injectStarsLayer();
  initHeroCanvas();
  initThreeParticles();
});
