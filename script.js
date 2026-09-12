/* =====================================================
   PORTFOLIO JAVASCRIPT
   Custom cursor, scroll animations, typed text, etc.
   ===================================================== */

// ──────────────────────────────────────────────────────
//  SPATIAL ORB CURSOR & PARTICLE SYSTEM
// ──────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let isMouseDown = false;
let lastSpawnX = 0, lastSpawnY = 0;

// Spatial pastel color palette
const spatialColors = [
    'rgba(79, 70, 229, 0.35)',  // Indigo
    'rgba(124, 58, 237, 0.3)',  // Violet
    'rgba(59, 130, 246, 0.3)',  // Blue
    'rgba(147, 51, 234, 0.25)', // Purple
    'rgba(249, 115, 22, 0.2)'   // Orange glow
];

function spawnSpatialParticle(x, y, isBurst = false) {
    const p = document.createElement('div');
    const size = isBurst
        ? (Math.random() * 16 + 10)
        : (Math.random() * 8 + 4);
    const color = spatialColors[Math.floor(Math.random() * spatialColors.length)];
    const angle = isBurst
        ? (Math.random() * Math.PI * 2)
        : (Math.random() * Math.PI * 2); // Float in any direction
    const speed = isBurst
        ? (Math.random() * 90 + 30)
        : (Math.random() * 35 + 10);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - (isBurst ? 0 : 10); // slightly upward float
    const life = isBurst ? (Math.random() * 600 + 400) : (Math.random() * 400 + 200);

    p.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9) 0%, ${color} 70%, transparent 100%);
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        filter: blur(${isBurst ? 0.5 : 0.2}px);
        box-shadow: 1px 1px 3px rgba(0,0,0,0.05);
    `;
    document.body.appendChild(p);

    const start = performance.now();
    let px = x, py = y;

    function animate(now) {
        const elapsed = now - start;
        const progress = elapsed / life;
        if (progress >= 1) { p.remove(); return; }
        const friction = 0.96;
        px += vx * (1 / 60) * Math.pow(friction, elapsed / 16);
        py += vy * (1 / 60) * Math.pow(friction, elapsed / 16) - 0.25; // slowly rise
        const opacity = 1 - progress;
        const scale = isBurst ? (1 - progress * 0.7) : (0.7 + progress * 0.5);
        p.style.left = px + 'px';
        p.style.top = py + 'px';
        p.style.opacity = opacity;
        p.style.transform = `translate(-50%, -50%) scale(${scale})`;
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
        const count = isMouseDown ? 4 : 1;
        for (let i = 0; i < count; i++) {
            spawnSpatialParticle(
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
    for (let i = 0; i < 15; i++) {
        spawnSpatialParticle(
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
//  MULTI-LANGUAGE NAME TYPEWRITER EFFECT
// ──────────────────────────────────────────────────────
const nameText = document.getElementById('name-text');
const nameList = [
    'Adwaith Santhosh', // English
    'അദ്വൈത് സന്തോഷ്',  // Malayalam
    'अद्वैत सन्तोषः',    // Sanskrit
    'अद्वैत संतोष',     // Hindi
    'アドワイス・サントシュ', // Japanese
    'Адвайт Сантош',    // Russian
    'أدوايث سانتوش'     // Arabic
];

let nameIdx = 0;
let nameCharIdx = nameList[0].length;
let nameDeleting = true; // Start by deleting English name after standard initial pause

const typingSpeed = 100;      // 1 letter every second

const deletingSpeed = 80;

const pauseAfterTyping = 4000;

const pauseAfterDeleting = 500;

function typeName() {
    if (!nameText) return;
    const current = nameList[nameIdx];

    if (!nameDeleting) {
        nameText.textContent = current.slice(0, ++nameCharIdx);
        if (nameCharIdx === current.length) {
            nameDeleting = true;
            setTimeout(typeName, 2200);
            return;
        }
    } else {
        nameText.textContent = current.slice(0, --nameCharIdx);
        if (nameCharIdx === 0) {
            nameDeleting = false;
            nameIdx = (nameIdx + 1) % nameList.length;
        }
    }
    setTimeout(
        typeName,
        nameDeleting
            ? deletingSpeed
            : typingSpeed
    );
}

if (nameText) {
    setTimeout(typeName, pauseAfterTyping);
}

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

const submitBtn = document.getElementById('submitBtn');
const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };

        sessionStorage.setItem(
            "contactFormData",
            JSON.stringify(formData)
        );

        window.location.href = "sending.html";

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
`;
document.head.appendChild(styleSheet);
