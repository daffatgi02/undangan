/**
 * Halal Bihalal — Animations, Countdown & Utilities
 * GSAP 3.12 + ScrollTrigger + Canvas Particles
 */
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
    initParticles();
    initCountdown();
    initNoteReveal();
    initGuestName();

    /* ── SECTION 1: OPENING ─────────────────────── */
    const o = gsap.timeline({ defaults: { ease: "expo.out" } });
    o.from("#crescent", { y: -50, opacity: 0, duration: 1.8, ease: "back.out(1.5)" })
     .from("#bismillah", { y: 30, opacity: 0, duration: 1.6 }, "-=1.2")
     .from("#greeting", { y: 15, opacity: 0, duration: 1.2 }, "-=1")
     .from("#scroll-hint", { y: 15, opacity: 0, duration: 1 }, "-=0.8")
     .from(".ornament", { scale: 0, opacity: 0, duration: 2, stagger: .15, ease: "back.out(1.2)" }, "-=1.8");

    /* Lantern sway */
    gsap.to("#lantern-l, #lantern-r", { rotation: 5, transformOrigin: "top center", duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: .5 });

    /* ── SECTION 2: TITLE ───────────────────────── */
    const t = gsap.timeline({ scrollTrigger: { trigger: "#s-title", start: "top 75%", toggleActions: "play none none reverse" }, defaults: { ease: "power4.out" } });
    t.from("#title-frame", { scale: .9, opacity: 0, y: 30, duration: 1.5, ease: "expo.out" })
     .from("#company-logo", { scale: 0.8, opacity: 0, duration: 1.5, ease: "back.out(1.4)" }, "-=1.2")
     .from("#label-undangan", { y: 20, opacity: 0, duration: 1 }, "-=1")
     .from("#title-main", { y: 40, opacity: 0, scale: .95, duration: 1.5 }, "-=0.8")
     .from("#company", { y: 15, opacity: 0, duration: 1 }, "-=0.6");

    /* ── SECTION 3: COUNTDOWN + CARDS ───────────── */
    gsap.from("#countdown-section", { scrollTrigger: { trigger: "#s-details", start: "top 75%", toggleActions: "play none none reverse" }, y: 50, opacity: 0, duration: 1.5, ease: "power4.out" });
    gsap.from(".card", { scrollTrigger: { trigger: "#cards-grid", start: "top 80%", toggleActions: "play none none reverse" }, y: 60, opacity: 0, scale: .95, duration: 1.2, stagger: .15, ease: "expo.out" });

    /* ── SECTION 4: MAP ─────────────────────────── */
    gsap.from("#map-wrap", { scrollTrigger: { trigger: "#s-map", start: "top 80%", toggleActions: "play none none reverse" }, y: 50, opacity: 0, scale: .95, duration: 1.5, ease: "power4.out" });

    /* ── SECTION 5: NOTE CARD ──────────────────── */
    /* (handled by initNoteReveal) */

    /* ── SECTION 6: CLOSING ─────────────────────── */
    const c = gsap.timeline({ scrollTrigger: { trigger: "#s-closing", start: "top 75%", toggleActions: "play none none reverse" }, defaults: { ease: "power4.out" } });
    c.from("#closing-quote", { y: 40, opacity: 0, duration: 1.5 })
     .from("#dresscode", { y: 20, opacity: 0, duration: 1 }, "-=.8")
     .from("#action-btns", { y: 20, opacity: 0, duration: 1 }, "-=.7")
     .from("#mosque-svg", { y: 50, opacity: 0, duration: 1.8 }, "-=.8");

    /* ── PARALLAX ───────────────────────────────── */
    gsap.to("#crescent", { y: -80, ease: "none", scrollTrigger: { trigger: "#s-opening", start: "top top", end: "bottom top", scrub: 1.5 } });
    gsap.to(".pattern-bg", { backgroundPositionY: "+=300px", ease: "none", scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 3 } });
    gsap.to("#mosque-svg", { y: -25, ease: "none", scrollTrigger: { trigger: "#s-closing", start: "top bottom", end: "bottom bottom", scrub: 2 } });

    /* Floating stars */
    gsap.to("#fs1", { y: "+=25", rotation: 30, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to("#fs2", { y: "-=20", rotation: -25, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });

    /* ── INTERACTIVE CARD TILT ───────────────────── */
    document.querySelectorAll(".card").forEach(el => {
        el.addEventListener("mousemove", e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            gsap.to(el, { rotateY: x * 14, rotateX: -y * 14, duration: .4, ease: "power2.out", transformPerspective: 800 });
        });
        el.addEventListener("mouseleave", () => {
            gsap.to(el, { rotateY: 0, rotateX: 0, duration: .8, ease: "elastic.out(1, .5)" });
        });
    });
});

/* ═══════════════════════════════════════════════════
   COUNTDOWN TIMER
   ═══════════════════════════════════════════════════ */
function initCountdown() {
    const target = new Date("2026-03-28T09:00:00+07:00").getTime();
    function update() {
        const now = Date.now();
        const diff = target - now;
        if (diff <= 0) {
            document.getElementById("cd-d").textContent = "0";
            document.getElementById("cd-h").textContent = "0";
            document.getElementById("cd-m").textContent = "0";
            document.getElementById("cd-s").textContent = "0";
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById("cd-d").textContent = d;
        document.getElementById("cd-h").textContent = String(h).padStart(2, "0");
        document.getElementById("cd-m").textContent = String(m).padStart(2, "0");
        document.getElementById("cd-s").textContent = String(s).padStart(2, "0");
    }
    update();
    setInterval(update, 1000);
}

/* ═══════════════════════════════════════════════════
   ADD TO CALENDAR (.ics)
   ═══════════════════════════════════════════════════ */
function addToCalendar() {
    const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
        "DTSTART:20260328T020000Z", "DTEND:20260328T060000Z",
        "SUMMARY:Halal Bihalal PT Wijaya Inovasi Gemilang",
        "DESCRIPTION:Undangan Halal Bihalal PT WIG. Dresscode: Hitam.",
        "LOCATION:The Heaven Floating, DI Yogyakarta",
        "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "halal-bihalal-wig.ics";
    a.click();
    URL.revokeObjectURL(a.href);
}

/* ═══════════════════════════════════════════════════
   SHARE INVITATION
   ═══════════════════════════════════════════════════ */
function shareInvitation() {
    const text = "Undangan Halal Bihalal\nPT Wijaya Inovasi Gemilang\n\n📅 Sabtu, 28 Maret 2026\n🕘 09.00 - 13.00 WIB\n📍 The Heaven Floating, DI Yogyakarta\n👔 Dresscode: Hitam\n\n📌 Maps: https://maps.app.goo.gl/xdpmu8cgcMAKV9wz5";
    if (navigator.share) {
        navigator.share({ title: "Undangan Halal Bihalal", text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => alert("Undangan disalin ke clipboard!"));
    }
}

/* ═══════════════════════════════════════════════════
   PARTICLE SYSTEM
   ═══════════════════════════════════════════════════ */
function initParticles() {
    const c = document.getElementById("particles");
    if (!c) return;
    const ctx = c.getContext("2d");
    const N = 60;
    let ps = [];

    function resize() { c.width = innerWidth; c.height = innerHeight; }
    function mk() {
        return { x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.5 + .4, vy: -(Math.random() * .25 + .08), vx: (Math.random() - .5) * .15, o: Math.random() * .45 + .1, p: Math.random() * Math.PI * 2 };
    }
    function init() { resize(); ps = Array.from({ length: N }, mk); }
    function draw() {
        ctx.clearRect(0, 0, c.width, c.height);
        ps.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.p += .02;
            const op = p.o * (.6 + Math.sin(p.p) * .4);
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201,168,76,${op})`; ctx.fill();
            if (p.y < -10) { p.y = c.height + 10; p.x = Math.random() * c.width; }
            if (p.x < -10 || p.x > c.width + 10) p.x = Math.random() * c.width;
        });
        requestAnimationFrame(draw);
    }
    addEventListener("resize", resize);
    init(); draw();
}

/* ═══════════════════════════════════════════════════
   SPLASH SCREEN + MUSIC AUTOPLAY
   ═══════════════════════════════════════════════════ */
function openInvitation() {
    const splash = document.getElementById("splash");
    const bgm = document.getElementById("bgm");
    splash.classList.add("hide");
    if (bgm) {
        bgm.volume = 0.4;
        bgm.play().catch(() => {});
    }
    document.getElementById("music-toggle").classList.add("playing");
}

function toggleMusic() {
    const bgm = document.getElementById("bgm");
    const btn = document.getElementById("music-toggle");
    if (!bgm) return;
    if (bgm.paused) {
        bgm.play().catch(() => {});
        btn.classList.add("playing");
    } else {
        bgm.pause();
        btn.classList.remove("playing");
    }
}

/* ═══════════════════════════════════════════════════
   NOTE CARD REVEAL (Doorprize)
   ═══════════════════════════════════════════════════ */
function initNoteReveal() {
    const el = document.getElementById("note-card");
    if (!el) return;
    gsap.from(el, {
        scrollTrigger: {
            trigger: "#s-note",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "back.out(1.4)"
    });
}

/* ═══════════════════════════════════════════════════
   GUEST NAME (resolved via backend slug API)
   ═══════════════════════════════════════════════════ */
async function initGuestName() {
    const guestNameEl = document.getElementById('guest-name');
    const guestWrapper = document.getElementById('guest-wrapper');

    // Extract slug from path: /inv/:slug
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[2]; // e.g. /inv/a3f9bc12 → "a3f9bc12"

    if (!slug || !guestWrapper) return;

    try {
        const res = await fetch(`/api/guest/${slug}`);
        if (!res.ok) throw new Error('not found');
        const data = await res.json();
        if (guestNameEl) guestNameEl.textContent = data.name;
    } catch {
        // Link invalid or server not found — hide the section
        if (guestWrapper) guestWrapper.style.display = 'none';
    }
}
