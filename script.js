/* ═══════════════════════════════════════════════════════════
   LOVE HINGU — Elite Cyber Security Portfolio
   Interactive Cyber Cursor, BlurText, Three.js 3D & Image Inspector
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM Helper Utilities ── */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. DYNAMIC COPYRIGHT YEAR ── */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── 2. INITIAL LOADING SCREEN ── */
  const loader = $('#loader');
  const loaderProgress = $('.loader-progress');
  let currentProgress = 0;

  function setLoaderProgress(val) {
    currentProgress = Math.min(100, val);
    if (loaderProgress) loaderProgress.style.width = currentProgress + '%';
  }

  function dismissLoader() {
    setLoaderProgress(100);
    setTimeout(() => {
      if (loader) loader.classList.add('done');
    }, 380);
  }

  if (!prefersReducedMotion) {
    setLoaderProgress(35);
    setTimeout(() => setLoaderProgress(70), 180);
    setTimeout(() => setLoaderProgress(95), 450);
  } else {
    if (loader) loader.classList.add('done');
  }

  /* ── 3. PROFESSIONAL CUSTOM INTERACTIVE CYBER CURSOR ── */
  const cursor = $('#custom-cursor');
  if (cursor && !isTouchDevice && !prefersReducedMotion) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    const dot = $('.cursor-dot', cursor);
    const ring = $('.cursor-ring', cursor);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    }, { passive: true });

    function renderCursor() {
      // Smooth lerp for trailing ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover Elements
    const hoverTargets = 'a, button, .inspectable, .avatar-capsule, .inspect-btn, .inspect-floating-btn, .spec-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.remove('cursor-hover');
      }
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  /* ── 4. BLUR-TEXT ANIMATION (HERO DISPLAY NAME) ── */
  function initBlurText() {
    const blurWords = $$('.blur-text-word');
    blurWords.forEach((wordEl) => {
      const text = wordEl.getAttribute('data-blur-text') || wordEl.textContent.trim();
      wordEl.textContent = '';
      const letters = text.split('');

      letters.forEach((letter, i) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        span.style.filter = 'blur(12px)';
        span.style.opacity = '0';
        span.style.transform = 'translateY(-24px)';
        span.style.transition = `all 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 75 + 150}ms`;
        wordEl.appendChild(span);

        // Trigger reveal
        setTimeout(() => {
          span.style.filter = 'blur(0px)';
          span.style.opacity = '1';
          span.style.transform = 'translateY(0)';
        }, 100);
      });
    });
  }
  if (!prefersReducedMotion) {
    initBlurText();
  }

  /* ── 5. NAVIGATION & SCROLL HIGHLIGHTING ── */
  const navHeader = $('#nav-header');
  const navToggle = $('#nav-toggle');
  const navMenu = $('#nav-menu');

  let scrollTicking = false;
  function handleNavScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        if (navHeader) {
          navHeader.classList.toggle('scrolled', window.scrollY > 40);
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    $$('a', navMenu).forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active section tracking in nav
  const trackedSections = $$('section[id]');
  const navLinks = $$('[data-nav]');

  function highlightActiveNav() {
    const scrollTrigger = window.scrollY + 180;
    trackedSections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollTrigger >= top && scrollTrigger < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }
  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  /* ── 6. SCROLL REVEALS (IntersectionObserver) ── */
  if (!prefersReducedMotion) {
    const revealTargets = $$('.anim-up');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const parent = entry.target.parentElement;
            const siblings = parent ? $$('.anim-up', parent) : [];
            const index = siblings.indexOf(entry.target);
            const staggerDelay = index >= 0 ? index * 60 : 0;

            setTimeout(() => {
              entry.target.classList.add('visible');
            }, staggerDelay);

            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    $$('.anim-up').forEach(el => el.classList.add('visible'));
  }

  /* ── 7. SMOOTH SCROLL WITH HEADER OFFSET ── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ═══════════════════════════════════════════════════════════
     8. FULL INTERACTIVE SCREENSHOT INSPECTOR MODAL
     ═══════════════════════════════════════════════════════════ */
  const GALLERY_DATA = {
    shieldcore: {
      name: "LVShieldCore — SIEM Endpoint Defense",
      category: "PRIMARY SIEM DASHBOARD EVIDENCE",
      images: [
        {
          src: "src/LV-SHILDCORE/shieldcore-dashboard.jpg",
          caption: "Operations Overview — Live endpoint process engine, host telemetry stream, and real-time MITRE ATT&CK alerting console."
        },
        {
          src: "src/LV-SHILDCORE/shieldcore-telemetry.jpg",
          caption: "Telemetry Explorer — Searching and filtering endpoint telemetry collected from Sysmon Event ID 1 in raw JSON storage."
        },
        {
          src: "src/LV-SHILDCORE/shieldcore-hero.jpg",
          caption: "3D Spatial Telemetry Warp Stream — Spatial corridor navigation for live SOC threat visualization."
        },
        {
          src: "src/LV-SHILDCORE/shieldcore-alerts.jpg",
          caption: "Threat Detection & Alert View — Sysmon Event ID 1 telemetry validation with process lineage inspection."
        }
      ]
    },
    phantom: {
      name: "PHANTOM:360 — Video Intelligence & Surveillance",
      category: "GUJARAT POLICE HACKATHON PROJECT",
      images: [
        {
          src: "src/PHANTOM/phantom-dashboard.png",
          caption: "Statewide CCTV Wall (Live 4-Quad Matrix) — 30 online camera feeds with YOLO inference engine and active threat alerts."
        },
        {
          src: "src/PHANTOM/phantom-login.png",
          caption: "Command Access Portal — Gujarat Police Statewide CCTV & ANPR Network with TLS 1.3 authentication."
        },
        {
          src: "src/PHANTOM/4.png",
          caption: "AI Sentinel ANPR Telemetry — Vehicle number plate recognition model integrated with India RTO database."
        },
        {
          src: "src/PHANTOM/6.png",
          caption: "Camera Registry & Stream Diagnostics — Sub-second latency pipeline across municipal intersection cameras."
        },
        {
          src: "src/PHANTOM/9.png",
          caption: "Live Stream Diagnostics — RTSP, WHEP, and HLS multi-protocol video delivery pipeline."
        },
        {
          src: "src/PHANTOM/12.png",
          caption: "District Quadrant Monitoring & Automated Threat Incident Logging."
        }
      ]
    },
    lvtrade: {
      name: "LVTrade — Quantitative Market Engine",
      category: "PREDICTIVE ANALYTICS & ML MODELS",
      images: [
        {
          src: "src/LV-TRADE/lvtrade-overview.png",
          caption: "Quantitative Trading Engine Overview — Multi-model machine learning analytics and backtesting terminal."
        },
        {
          src: "src/LV-TRADE/Screenshot 2026-10-29 184757.png",
          caption: "Interactive Candlestick Market Terminal — Real-time charts layered with EMA20, EMA50, and Bollinger Bands."
        },
        {
          src: "src/LV-TRADE/Screenshot 2026-10-29 184839.png",
          caption: "AI Decision Analytics — Direct prediction indicators showing buy/sell probabilities and quantitative factors."
        },
        {
          src: "src/LV-TRADE/Screenshot 2026-10-29 184855.png",
          caption: "Machine Learning Training Hub — Custom classifiers using Random Forest and XGBoost with feature importances."
        }
      ]
    }
  };

  const inspector = $('#image-inspector');
  const inspectorBackdrop = $('.inspector-backdrop', inspector);
  const inspectorCloseBtn = $('#inspector-close-btn');
  const inspectorPrev = $('#inspector-prev');
  const inspectorNext = $('#inspector-next');
  const inspectorCategory = $('#inspector-category');
  const inspectorProjectName = $('#inspector-project-name');
  const inspectorCounter = $('#inspector-counter');
  const inspectorMainImg = $('#inspector-main-img');
  const inspectorCaption = $('#inspector-caption');
  const inspectorThumbStrip = $('#inspector-thumb-strip');

  let currentGalleryKey = null;
  let currentImageIndex = 0;

  function openInspector(galleryKey, startIndex = 0) {
    if (!GALLERY_DATA[galleryKey]) return;
    currentGalleryKey = galleryKey;
    currentImageIndex = startIndex;

    const data = GALLERY_DATA[galleryKey];
    inspectorCategory.textContent = data.category;
    inspectorProjectName.textContent = data.name;

    // Build thumbnail strip
    inspectorThumbStrip.innerHTML = '';
    data.images.forEach((img, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `inspector-thumb ${idx === startIndex ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${img.src}" alt="Thumbnail ${idx + 1}" />`;
      thumb.addEventListener('click', () => {
        showImage(idx);
      });
      inspectorThumbStrip.appendChild(thumb);
    });

    showImage(startIndex);

    inspector.classList.add('active');
    inspector.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeInspector() {
    inspector.classList.remove('active');
    inspector.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showImage(index) {
    if (!currentGalleryKey) return;
    const images = GALLERY_DATA[currentGalleryKey].images;
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentImageIndex = index;

    const current = images[index];
    inspectorMainImg.style.opacity = '0';

    setTimeout(() => {
      inspectorMainImg.src = current.src;
      inspectorMainImg.alt = current.caption;
      inspectorCaption.textContent = current.caption;
      inspectorCounter.textContent = `${index + 1} / ${images.length}`;
      inspectorMainImg.style.opacity = '1';

      // Update active thumbnail
      $$('.inspector-thumb', inspectorThumbStrip).forEach((t, i) => {
        t.classList.toggle('active', i === index);
      });
    }, 150);
  }

  // Event Listeners for Inspector
  if (inspector) {
    inspectorCloseBtn?.addEventListener('click', closeInspector);
    inspectorBackdrop?.addEventListener('click', closeInspector);

    inspectorPrev?.addEventListener('click', () => {
      showImage(currentImageIndex - 1);
    });
    inspectorNext?.addEventListener('click', () => {
      showImage(currentImageIndex + 1);
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!inspector.classList.contains('active')) return;
      if (e.key === 'Escape') closeInspector();
      if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
    });

    // Attach click triggers on inspectable elements and buttons
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-open-gallery]');
      if (openBtn) {
        e.preventDefault();
        const gallery = openBtn.getAttribute('data-open-gallery');
        openInspector(gallery, 0);
        return;
      }

      const inspectableImg = e.target.closest('.inspectable');
      if (inspectableImg) {
        e.preventDefault();
        const gallery = inspectableImg.getAttribute('data-gallery');
        const index = parseInt(inspectableImg.getAttribute('data-index') || '0', 10);
        openInspector(gallery, index);
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     9. THREE.JS: GLASSY HOLOGRAPHIC EMERALD GREEN CYBER EARTH
     ═══════════════════════════════════════════════════════════ */
  function createSoftParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(74, 222, 128, 0.95)'); // Emerald Green
    grad.addColorStop(0.65, 'rgba(16, 185, 129, 0.35)'); // Cyber Green Glow
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  function initCyberSculpture() {
    if (typeof THREE === 'undefined') {
      const canvas = $('#hero-canvas');
      if (canvas) canvas.style.display = 'none';
      dismissLoader();
      return;
    }

    const canvas = $('#hero-canvas');
    if (!canvas) return;

    // 1. Scene & Camera Setup (Centered & Transparent)
    const scene = new THREE.Scene();
    scene.background = null; // 100% Transparent background

    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    // 2. WebGL Renderer with High-Precision Antialiasing
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'highp',
      });
    } catch (err) {
      canvas.style.display = 'none';
      dismissLoader();
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Strict 100% transparent clear color

    // 3. Cyber Emerald & Lime Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x06140c, 0.7);
    scene.add(ambientLight);

    // Primary Cyber Emerald Point Light (Top-Right Front)
    const greenLight1 = new THREE.PointLight(0x10b981, 1.8, 14);
    greenLight1.position.set(3.0, 2.4, 2.5);
    scene.add(greenLight1);

    // Secondary Neon Lime Point Light (Bottom-Left Front)
    const greenLight2 = new THREE.PointLight(0x4ade80, 1.3, 14);
    greenLight2.position.set(-3.0, -2.0, 2.0);
    scene.add(greenLight2);

    // Top Rim Specular Light
    const topRimLight = new THREE.DirectionalLight(0xa7f3d0, 0.7);
    topRimLight.position.set(0, 4.5, 3.0);
    scene.add(topRimLight);

    // 4. Centered Glassy Holographic Earth Globe Group
    const sculptureGroup = new THREE.Group();
    const GLOBE_RADIUS = 1.15;
    const softParticleTexture = createSoftParticleTexture();

    // A. Glassy Translucent Inner Earth Core (Translucent Optic Glass)
    const coreGeo = new THREE.IcosahedronGeometry(0.72, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x051a11,
      roughness: 0.18,
      metalness: 0.25,
      transparent: true,
      opacity: 0.16,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    sculptureGroup.add(coreMesh);

    // B. Matrix Wireframe Lattice Cage (Subtle Emerald Geometry)
    const cageGeo = new THREE.IcosahedronGeometry(GLOBE_RADIUS, 2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    sculptureGroup.add(cageMesh);

    // C. Anti-Aliased Meridian & Equatorial Orbit Rings (Smooth LineLoops)
    function createSmoothRing(radius, colorHex, opacity) {
      const segments = 128;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: opacity,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.LineLoop(geo, mat);
    }

    // Ring 1 (Tilted Equatorial Ring - Emerald)
    const ring1 = createSmoothRing(1.36, 0x22c55e, 0.32);
    ring1.rotation.x = Math.PI * 0.42;
    ring1.rotation.y = Math.PI * 0.18;
    sculptureGroup.add(ring1);

    // Ring 2 (Polar Orbit Ring - Neon Green)
    const ring2 = createSmoothRing(1.48, 0x4ade80, 0.26);
    ring2.rotation.x = -Math.PI * 0.32;
    ring2.rotation.z = Math.PI * 0.28;
    sculptureGroup.add(ring2);

    // Ring 3 (Declination Ring - Cyber Lime)
    const ring3 = createSmoothRing(1.60, 0xa3e635, 0.18);
    ring3.rotation.x = Math.PI * 0.65;
    ring3.rotation.y = -Math.PI * 0.22;
    sculptureGroup.add(ring3);

    // D. Soft Anti-Aliased Network Data Nodes (Glowing Emerald Beacons)
    const NODE_COUNT = 90;
    const nodePositions = [];
    const nodeCoords = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = GLOBE_RADIUS * (0.97 + Math.random() * 0.06);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      nodeCoords[i * 3] = x;
      nodeCoords[i * 3 + 1] = y;
      nodeCoords[i * 3 + 2] = z;

      nodePositions.push(new THREE.Vector3(x, y, z));
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodeCoords, 3));

    const nodeMat = new THREE.PointsMaterial({
      size: 0.085,
      map: softParticleTexture,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    sculptureGroup.add(nodePoints);

    // E. Fine Cyber Emerald Network Connection Lines
    const lineCoords = [];
    const MAX_CONNECTIONS = 100;

    for (let i = 0; i < NODE_COUNT && (lineCoords.length / 6) < MAX_CONNECTIONS; i++) {
      for (let j = i + 1; j < NODE_COUNT && (lineCoords.length / 6) < MAX_CONNECTIONS; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 0.52 && Math.random() > 0.44) {
          lineCoords.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const networkLines = new THREE.LineSegments(linesGeo, linesMat);
    sculptureGroup.add(networkLines);

    // F. Orbiting Satellites (Clean Luminous Green Sentinel Beads)
    const sentinelCount = 3;
    const sentinels = [];
    const sentinelMat = new THREE.PointsMaterial({
      size: 0.13,
      map: softParticleTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < sentinelCount; i++) {
      const sGeo = new THREE.BufferGeometry();
      sGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
      const sMesh = new THREE.Points(sGeo, sentinelMat);
      sculptureGroup.add(sMesh);
      sentinels.push({
        mesh: sMesh,
        orbitRadius: 1.36 + i * 0.12,
        speed: 0.42 + i * 0.16,
        angleOffset: (Math.PI * 2 * i) / sentinelCount,
        inclination: (i % 2 === 0 ? 0.42 : -0.32) * Math.PI,
      });
    }

    scene.add(sculptureGroup);

    // 5. Responsive Center Placement Across All Devices (iPhone, Android, Desktop)
    function updateSpatialLayout() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Always perfectly centered in the background of the hero section
      if (w >= 1024) {
        // Desktop
        sculptureGroup.position.set(0, 0.05, -0.2);
        sculptureGroup.scale.set(1.22, 1.22, 1.22);
      } else if (w >= 768) {
        // Tablet / iPad
        sculptureGroup.position.set(0, 0.0, -0.2);
        sculptureGroup.scale.set(0.95, 0.95, 0.95);
      } else {
        // iPhone / Android Mobile
        sculptureGroup.position.set(0, -0.05, -0.2);
        sculptureGroup.scale.set(0.72, 0.72, 0.72);
      }
    }
    window.addEventListener('resize', updateSpatialLayout);
    window.addEventListener('orientationchange', updateSpatialLayout);
    updateSpatialLayout();

    // 6. Smooth Interactive Mouse & Touch Tracking Effects
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let mouseVelocityX = 0, mouseVelocityY = 0;
    let lastMouseX = 0, lastMouseY = 0;

    // Desktop Mouse Tracking
    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Calculate instantaneous mouse velocity for dynamic spin impulse
      mouseVelocityX = (e.clientX - lastMouseX) * 0.0008;
      mouseVelocityY = (e.clientY - lastMouseY) * 0.0008;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }, { passive: true });

    // Mobile / iPhone Touch Tracking (without interfering with scrolling)
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetMouseX = (touch.clientX / window.innerWidth - 0.5) * 1.5;
        targetMouseY = (touch.clientY / window.innerHeight - 0.5) * 1.5;
      }
    }, { passive: true });

    // 7. Scroll-based Opacity & GPU Optimization
    let scrollFade = 1.0;
    function handleScrollFade() {
      const heroThreshold = window.innerHeight * 0.9;
      const currentScroll = window.scrollY;
      scrollFade = Math.max(0, 1 - currentScroll / heroThreshold);
    }
    window.addEventListener('scroll', handleScrollFade, { passive: true });

    // 8. Animation Loop
    let animId;
    const clock = new THREE.Clock();
    let isTabVisible = true;

    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        clock.getDelta();
        renderScene();
      }
    });

    function renderScene() {
      if (!isTabVisible) return;
      animId = requestAnimationFrame(renderScene);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Pause rendering if scrolled past hero (zero GPU overhead)
      if (scrollFade <= 0.01) {
        sculptureGroup.visible = false;
        return;
      }
      sculptureGroup.visible = true;

      // Smooth mouse lerping with inertia
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Attenuate mouse velocity impulse
      mouseVelocityX *= 0.92;
      mouseVelocityY *= 0.92;

      // Centered globe rotation & dynamic mouse tilt
      sculptureGroup.rotation.y = elapsed * 0.07 + mouseX * 0.35 + mouseVelocityX;
      sculptureGroup.rotation.x = Math.sin(elapsed * 0.05) * 0.06 + mouseY * 0.22 + mouseVelocityY;
      sculptureGroup.position.y += Math.sin(elapsed * 0.8) * 0.0004;

      // Multi-axis independent ring precession
      ring1.rotation.z = elapsed * 0.09;
      ring2.rotation.y = elapsed * -0.11;
      ring3.rotation.x = elapsed * 0.08;

      // Subtle core facet counter-rotation
      coreMesh.rotation.y = elapsed * -0.03;
      cageMesh.rotation.y = elapsed * 0.04;

      // Orbiting sentinel satellites
      sentinels.forEach((s) => {
        const theta = elapsed * s.speed + s.angleOffset;
        s.mesh.position.set(
          s.orbitRadius * Math.cos(theta),
          s.orbitRadius * Math.sin(theta) * Math.sin(s.inclination),
          s.orbitRadius * Math.sin(theta) * Math.cos(s.inclination)
        );
      });

      // Luminous node pulse with scroll fade
      nodeMat.opacity = (0.70 + Math.sin(elapsed * 1.8) * 0.18) * scrollFade;
      linesMat.opacity = 0.22 * scrollFade;
      cageMat.opacity = 0.14 * scrollFade;

      renderer.render(scene, camera);
    }

    if (!prefersReducedMotion) {
      renderScene();
    } else {
      // Single static render for reduced motion users
      renderer.render(scene, camera);
    }

    dismissLoader();
  }

  // Safe initialization on window load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof THREE !== 'undefined') {
        initCyberSculpture();
      } else {
        const threeScript = document.querySelector('script[src*="three"]');
        if (threeScript) {
          threeScript.addEventListener('load', initCyberSculpture);
          threeScript.addEventListener('error', dismissLoader);
        } else {
          dismissLoader();
        }
      }
    });
  } else {
    if (typeof THREE !== 'undefined') {
      initCyberSculpture();
    } else {
      setTimeout(() => {
        if (typeof THREE !== 'undefined') initCyberSculpture();
        else dismissLoader();
      }, 150);
    }
  }

  // Failsafe loader dismissal after 2.5s
  setTimeout(dismissLoader, 2500);

})();
