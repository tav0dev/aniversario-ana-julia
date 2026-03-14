// ===== VIDEO INTRO LOGIC =====
const videoIntro = document.getElementById('video-intro');
const startOverlay = document.getElementById('start-overlay');
const skipBtn = document.getElementById('skip-btn');
const birthdayPage = document.getElementById('birthday-page');
const vimeoIframe = document.getElementById('vimeo-iframe');

let vimeoPlayer = null;

function showBirthdayPage() {
  videoIntro.classList.add('hidden');
  birthdayPage.classList.add('visible');
  document.body.style.overflow = 'auto';
  startParticles();
  startFloatingHearts();
}

// Play button click — start the video
startOverlay.addEventListener('click', () => {
  startOverlay.classList.add('hidden');
  skipBtn.classList.add('visible');

  // Use the Vimeo Player API on the existing iframe
  vimeoPlayer = new Vimeo.Player(vimeoIframe);

  vimeoPlayer.play().catch((err) => {
    console.warn('Autoplay blocked:', err);
  });

  vimeoPlayer.on('ended', () => {
    showBirthdayPage();
  });

  vimeoPlayer.on('error', (error) => {
    console.warn('Vimeo player error:', error);
    showBirthdayPage();
  });
});

// Skip button
skipBtn.addEventListener('click', () => {
  if (vimeoPlayer) {
    vimeoPlayer.pause();
  }
  showBirthdayPage();
});

// ===== PARTICLES =====
function startParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 280 : 340; // purple or pink
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinklePhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.twinklePhase += this.twinkleSpeed;
      this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.twinklePhase));

      if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.currentOpacity})`;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.currentOpacity * 0.15})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// ===== FLOATING HEARTS =====
function startFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const hearts = ['💜', '💕', '💗', '💖', '✨', '🦋'];

  function createHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = (Math.random() * 90) + '%';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    heart.style.animationDuration = (Math.random() * 8 + 8) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(heart);

    setTimeout(() => heart.remove(), 18000);
  }

  // Create initial hearts
  for (let i = 0; i < 5; i++) {
    setTimeout(createHeart, i * 600);
  }

  // Continue creating hearts
  setInterval(createHeart, 3000);
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-delay') || 0;
      setTimeout(() => {
        entry.target.classList.add('animate');
      }, parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// Prevent scroll while video is showing
document.body.style.overflow = 'hidden';
