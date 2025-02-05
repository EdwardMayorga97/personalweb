document.addEventListener('DOMContentLoaded', () => {
  /* =======================
     Menú Móvil y Navegación
  ======================== */
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.getElementById('nav-menu');

  mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const expanded = mobileMenu.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
    mobileMenu.setAttribute('aria-expanded', expanded);
  });

  // Botón "Back to Top"
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Scroll suave para enlaces de navegación
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      const offsetTop = targetSection.offsetTop - 60;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* =====================================
     Revelado de Secciones con IntersectionObserver
  ===================================== */
  const sections = document.querySelectorAll('.section');
  const revealOptions = { threshold: 0.15 };
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);
  sections.forEach(section => revealObserver.observe(section));

  /* =====================================
     Efecto Typewriter para Habilidades
  ===================================== */
  const typedSkills = document.getElementById('typed-skills');
  const skillsArray = [
    "Desarrollador Frontend",
    "Desarrollador Backend",
    "Desarrollador Full Stack"
  ];
  let skillIndex = 0,
      charIndex = 0;
  const typeSpeed = 100,
        eraseSpeed = 50,
        delayBetween = 2000;

  function typeSkill() {
    if (charIndex < skillsArray[skillIndex].length) {
      typedSkills.textContent += skillsArray[skillIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeSkill, typeSpeed);
    } else {
      setTimeout(eraseSkill, delayBetween);
    }
  }

  function eraseSkill() {
    if (charIndex > 0) {
      typedSkills.textContent = skillsArray[skillIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(eraseSkill, eraseSpeed);
    } else {
      skillIndex = (skillIndex + 1) % skillsArray.length;
      setTimeout(typeSkill, typeSpeed + 500);
    }
  }

  if (skillsArray.length) {
    setTimeout(typeSkill, 1000);
  }

  /* =====================================
     Efecto de Partículas (Fondo Neuronal)
     Usando clase para encapsular la lógica
  ===================================== */
  class ParticlesEffect {
    constructor(canvas, heroSection) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.heroSection = heroSection;
      this.resizeCanvas();

      this.numParticles = 100;
      this.maxDistance = 120;
      this.maxSpeed = 1.5;
      this.minSpeed = 0.5;
      this.particles = [];
      this.initParticles();

      window.addEventListener('resize', () => {
        this.resizeCanvas();
        this.initParticles();
      });
    }

    resizeCanvas() {
      this.canvasWidth = this.heroSection.clientWidth;
      this.canvasHeight = this.heroSection.clientHeight;
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;
    }

    initParticles() {
      this.particles = [];
      for (let i = 0; i < this.numParticles; i++) {
        const radius = Math.random() * 3 + 1;
        const x = Math.random() * this.canvasWidth;
        const y = Math.random() * this.canvasHeight;
        const vx = (Math.random() - 0.5) * 0.8;
        const vy = (Math.random() - 0.5) * 0.8;
        this.particles.push({ x, y, vx, vy, radius });
      }
    }

    updateParticles() {
      // Evitar superposición con el área de texto
      const heroContent = document.querySelector('.hero-content');
      const canvasRect = this.canvas.getBoundingClientRect();
      const textRect = heroContent.getBoundingClientRect();
      const textX = textRect.left - canvasRect.left;
      const textY = textRect.top - canvasRect.top;
      const textWidth = textRect.width;
      const textHeight = textRect.height;
      const textCenterX = textX + textWidth / 2;
      const textCenterY = textY + textHeight / 2;

      this.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > this.canvasWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > this.canvasHeight) particle.vy *= -1;

        if (
          particle.x > textX &&
          particle.x < textX + textWidth &&
          particle.y > textY &&
          particle.y < textY + textHeight
        ) {
          let dx = particle.x - textCenterX;
          let dy = particle.y - textCenterY;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          dx /= dist;
          dy /= dist;
          const force = 0.2;
          particle.vx += dx * force;
          particle.vy += dy * force;
        }

        let speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > this.maxSpeed) {
          particle.vx = (particle.vx / speed) * this.minSpeed;
          particle.vy = (particle.vy / speed) * this.minSpeed;
        }
      });
    }

    drawParticles() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        this.ctx.beginPath();
        this.ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0,230,230,0.8)';
        this.ctx.fill();
        this.ctx.closePath();

        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < this.maxDistance) {
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = 'rgba(0,230,230,' + (1 - distance / this.maxDistance) + ')';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            this.ctx.closePath();
          }
        }
      }
    }

    animate() {
      this.updateParticles();
      this.drawParticles();
      requestAnimationFrame(() => this.animate());
    }

    repulseParticles(clickX, clickY) {
      const repulsionRadius = 100;
      const repulsionForce = 5;
      this.particles.forEach(particle => {
        const dx = particle.x - clickX;
        const dy = particle.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < repulsionRadius) {
          const force = repulsionForce / (distance || 1);
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      });
    }
  }

  // Inicialización del efecto de partículas
  const canvas = document.getElementById('particles-canvas');
  const heroSection = document.getElementById('home');
  const particlesEffect = new ParticlesEffect(canvas, heroSection);
  particlesEffect.animate();

  // Repulsión de partículas al hacer clic en el canvas
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    particlesEffect.repulseParticles(clickX, clickY);
  });

  // Toggle de Efecto de Partículas
  const toggleParticlesBtn = document.getElementById('toggleParticles');
  let particlesEnabled = true;
  toggleParticlesBtn.addEventListener('click', () => {
    particlesEnabled = !particlesEnabled;
    canvas.style.display = particlesEnabled ? 'block' : 'none';
    toggleParticlesBtn.innerHTML = particlesEnabled
      ? '<i class="fas fa-toggle-on"></i>'
      : '<i class="fas fa-toggle-off"></i>';
  });

  /* =====================================
     Infinite Photo Slider (Auto-Sliding)
  ===================================== */
  const slider = document.querySelector('.photo-slider .slides');
  function moveSlide() {
    const firstSlide = slider.querySelector('.slide');
    // Calcula el ancho del slide (incluyendo el margen derecho de 20px)
    const slideWidth = firstSlide.getBoundingClientRect().width + 20;
    slider.style.transition = 'transform 0.5s ease';
    slider.style.transform = `translateX(-${slideWidth}px)`;

    slider.addEventListener('transitionend', function handler() {
      slider.style.transition = 'none';
      slider.appendChild(firstSlide);
      slider.style.transform = 'translateX(0)';
      slider.removeEventListener('transitionend', handler);
    });
  }
  setInterval(moveSlide, 3000);
});
