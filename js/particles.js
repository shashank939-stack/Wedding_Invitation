/**
 * पुष्पवर्षा एवं स्वर्णिम कण (Flower Petals & Golden Sparkle Particle Engine)
 * Realistic physics with gentle oscillation and natural petal flutter
 */
class RoyalPetalEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.sparkles = [];
    this.isActive = true;
    this.animationFrameId = null;

    // Colors: Rose red, marigold orange, golden yellow, soft pink
    this.petalColors = [
      { fill: '#E63946', border: '#9D0208' }, // Deep Rose
      { fill: '#F77F00', border: '#D62828' }, // Marigold Orange
      { fill: '#FCBF49', border: '#F77F00' }, // Marigold Yellow
      { fill: '#E01E37', border: '#6F1D1B' }, // Crimson Petal
      { fill: '#FFD166', border: '#D4AF37' }  // Golden Leaf
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Create initial pool of petals
    const count = window.innerWidth < 768 ? 28 : 55;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createPetal(true));
    }

    // Sparkles
    for (let i = 0; i < 25; i++) {
      this.sparkles.push(this.createSparkle(true));
    }

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createPetal(randomY = false) {
    const colorObj = this.petalColors[Math.floor(Math.random() * this.petalColors.length)];
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -30,
      size: 10 + Math.random() * 14,
      speedY: 1.0 + Math.random() * 2.0,
      speedX: -0.5 + Math.random() * 1.0,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.04,
      oscillationSpeed: 0.02 + Math.random() * 0.03,
      oscillationDistance: 15 + Math.random() * 30,
      baseX: Math.random() * this.width,
      color: colorObj,
      opacity: 0.7 + Math.random() * 0.3
    };
  }

  createSparkle(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : Math.random() * this.height,
      radius: 1 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.8,
      speedAlpha: (0.01 + Math.random() * 0.02) * (Math.random() > 0.5 ? 1 : -1)
    };
  }

  animate() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render Gold Sparkles
    for (let i = 0; i < this.sparkles.length; i++) {
      const s = this.sparkles[i];
      s.alpha += s.speedAlpha;
      if (s.alpha > 0.95 || s.alpha < 0.1) {
        s.speedAlpha = -s.speedAlpha;
      }

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 235, 150, ${Math.max(0, s.alpha)})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#FFD700';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // Render Falling Petals
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.angle += p.angularSpeed;
      p.x = p.baseX + Math.sin(p.y * p.oscillationSpeed) * p.oscillationDistance;

      if (p.y > this.height + 40) {
        this.particles[i] = this.createPetal(false);
        continue;
      }

      // Draw stylized curved floral petal
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.globalAlpha = p.opacity;

      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.quadraticCurveTo(p.size * 0.7, -p.size * 0.5, p.size, 0);
      this.ctx.quadraticCurveTo(p.size * 0.7, p.size * 0.5, 0, 0);
      this.ctx.fillStyle = p.color.fill;
      this.ctx.fill();

      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = p.color.border;
      this.ctx.stroke();

      this.ctx.restore();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  toggle() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.animate();
    } else {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    return this.isActive;
  }
}

window.RoyalPetalEngine = RoyalPetalEngine;
