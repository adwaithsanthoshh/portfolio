/* =====================================================
   PORTFOLIO JAVASCRIPT
   Custom cursor, scroll animations, typed text, etc.
   ===================================================== */

// ──────────────────────────────────────────────────────
//  FIRE CURSOR & PARTICLE SYSTEM
// ──────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let isMouseDown = false;
let lastSpawnX = 0, lastSpawnY = 0;

// Fire color palette
const fireColors = [
    '#ff2200', '#ff4400', '#ff6600', '#ff8800',
    '#ffaa00', '#ffcc00', '#fff0a0', '#ff3300'
];

function spawnFireParticle(x, y, isBurst = false) {
    const p = document.createElement('div');
    const size = isBurst
        ? (Math.random() * 18 + 8)
        : (Math.random() * 10 + 4);
    const color = fireColors[Math.floor(Math.random() * fireColors.length)];
    const angle = isBurst
        ? (Math.random() * Math.PI * 2)
        : (Math.random() * Math.PI - Math.PI * 1.3); // mostly upward
    const speed = isBurst
        ? (Math.random() * 80 + 30)
        : (Math.random() * 40 + 15);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - (isBurst ? 0 : 30);
    const life = isBurst ? (Math.random() * 500 + 300) : (Math.random() * 350 + 150);

    p.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size * 1.4}px;
        border-radius: 50% 50% 30% 30%;
        background: radial-gradient(ellipse at center bottom, #fff8a0 0%, ${color} 50%, transparent 100%);
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        filter: blur(${isBurst ? 1 : 0.5}px);
        mix-blend-mode: screen;
    `;
    document.body.appendChild(p);

    const start = performance.now();
    let px = x, py = y;

    function animate(now) {
        const elapsed = now - start;
        const progress = elapsed / life;
        if (progress >= 1) { p.remove(); return; }
        const friction = 0.97;
        px += vx * (1 / 60) * Math.pow(friction, elapsed / 16);
        py += vy * (1 / 60) * Math.pow(friction, elapsed / 16) + (isBurst ? 0.3 : -0.1);
        const opacity = 1 - progress;
        const scale = isBurst ? (1 - progress * 0.5) : (0.5 + progress * 0.5);
        p.style.left = px + 'px';
        p.style.top = py + 'px';
        p.style.opacity = opacity;
        p.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${progress * 180}deg)`;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// Trail on mouse move
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';

    // Throttle by distance
    const dx = mouseX - lastSpawnX, dy = mouseY - lastSpawnY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const threshold = isMouseDown ? 6 : 12;
    if (dist > threshold) {
        const count = isMouseDown ? 4 : 2;
        for (let i = 0; i < count; i++) {
            spawnFireParticle(
                mouseX + (Math.random() - 0.5) * 8,
                mouseY + (Math.random() - 0.5) * 8,
                false
            );
        }
        lastSpawnX = mouseX;
        lastSpawnY = mouseY;
    }
});

// Burst on click
document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    document.body.classList.add('cursor-click');
    for (let i = 0; i < 18; i++) {
        spawnFireParticle(
            e.clientX + (Math.random() - 0.5) * 10,
            e.clientY + (Math.random() - 0.5) * 10,
            true
        );
    }
});
document.addEventListener('mouseup', () => {
    isMouseDown = false;
    document.body.classList.remove('cursor-click');
});

// Smooth follower (fire ring)
(function lerpFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(lerpFollower);
})();

// Hover scale on interactive elements
const interactives = document.querySelectorAll(
    'a, button, .skill-cat-card, .project-card, input, textarea, .social-btn, .project-link-btn'
);
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ──────────────────────────────────────────────────────
//  NAVIGATION
// ──────────────────────────────────────────────────────
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// ──────────────────────────────────────────────────────
//  TYPED TEXT EFFECT
// ──────────────────────────────────────────────────────
const roles = [
    'AI Student @ Amrita',
    'Gen-AI Builder',
    'AI Agents & Automation',
    'Backend Developer',
    'Prompt Engineer'
];
let roleIdx = 0, charIdx = 0, deleting = false;
const roleText = document.getElementById('role-text');

function typeRole() {
    const current = roles[roleIdx];
    if (!deleting) {
        roleText.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typeRole, 1800);
            return;
        }
    } else {
        roleText.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
        }
    }
    setTimeout(typeRole, deleting ? 50 : 90);
}
setTimeout(typeRole, 1000);

// ──────────────────────────────────────────────────────
//  SCROLL REVEAL ANIMATIONS
// ──────────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ──────────────────────────────────────────────────────
//  COUNTER ANIMATION
// ──────────────────────────────────────────────────────
const counters = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            let current = 0;
            const step = Math.ceil(target / 50);
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                entry.target.textContent = current;
            }, 30);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ──────────────────────────────────────────────────────
//  SKILL BAR ANIMATION
// ──────────────────────────────────────────────────────
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.width = entry.target.dataset.width + '%';
            }, 200);
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ──────────────────────────────────────────────────────
//  SKILL CARD MOUSE GLOW
// ──────────────────────────────────────────────────────
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
    });
});

// ──────────────────────────────────────────────────────
//  PROJECT CARD 3D TILT EFFECT
// ──────────────────────────────────────────────────────
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotX = y * -6;
        const rotY = x * 6;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => card.style.transition = '', 600);
    });
});

// ──────────────────────────────────────────────────────
//  PARALLAX HERO ORBS
// ──────────────────────────────────────────────────────
const orbs = document.querySelectorAll('.orb');

document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
        const factor = (i + 1) * 12;
        orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
});

// ──────────────────────────────────────────────────────
//  CONTACT FORM
// ──────────────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.innerHTML = `
      <span>Sending…</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           style="animation: spin 1s linear infinite; width:16px; height:16px;">
        <circle cx="12" cy="12" r="10" stroke-dasharray="62.83" stroke-dashoffset="20"/>
      </svg>`;
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = `<span>Message Sent! 🎉</span>`;
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            contactForm.reset();
            setTimeout(() => {
                submitBtn.innerHTML = `<span>Send Message</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>`;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1800);
    });
}

// ──────────────────────────────────────────────────────
//  SMOOTH SCROLL FOR ANCHOR LINKS
// ──────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ──────────────────────────────────────────────────────
//  FOOTER — DYNAMIC YEAR
// ──────────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ──────────────────────────────────────────────────────
//  BACK TO TOP VISIBILITY
// ──────────────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
        backToTop.style.pointerEvents = window.scrollY > 400 ? 'all' : 'none';
    });
    backToTop.style.opacity = '0';
    backToTop.style.pointerEvents = 'none';
    backToTop.style.transition = 'opacity 0.3s';
}

// ──────────────────────────────────────────────────────
//  SPIN KEYFRAME FOR FORM BUTTON
// ──────────────────────────────────────────────────────
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .nav-link.active { color: var(--text); }
  .nav-link.active::after { left: 1rem; right: 1rem; }
`;
document.head.appendChild(styleSheet);
