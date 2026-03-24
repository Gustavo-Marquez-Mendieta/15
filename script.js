function detonarMagia() {
    const cancion = document.getElementById("musica");
    if (cancion) { cancion.volume = 0.5; cancion.play().catch(()=>{}); }

    crearChispas(50);

    const tl = gsap.timeline();
    tl.to("#wrapper-sobre", {
        scale: 3, opacity: 0, duration: 1, ease: "power2.in",
        onComplete: () => { document.getElementById("wrapper-sobre").style.display = "none"; }
    })
    .set("#capa-gato", { display: "flex", opacity: 0 })
    .to("#capa-gato", { opacity: 1, duration: 1 })
    .to("#capa-gato", {
        opacity: 0, duration: 0.8, delay: 1.5,
        onComplete: () => {
            document.getElementById("capa-gato").style.display = "none";
            iniciarBrillosCanvas();
            iniciarObservadorEntrada();
        }
    })
    .set("#invitacion-final", { display: "block", opacity: 0 })
    .to("#invitacion-final", { opacity: 1, duration: 1.2 });
}

/* ── Chispas globales ── */
function crearChispas(cant) {
    const cont = document.getElementById("particulas-container");
    const colores = ["#c084fc","#e9d5ff","#ffffff","#a855f7","#d8b4fe"];
    for (let i = 0; i < cant; i++) {
        const c = document.createElement("div");
        c.className = "chispa";
        c.style.left  = Math.random() * 100 + "vw";
        c.style.top   = Math.random() * 100 + "vh";
        c.style.animationDelay = Math.random() * 5 + "s";
        const s = (Math.random() * 3 + 1.5) + "px";
        c.style.width = s; c.style.height = s;
        const col = colores[Math.floor(Math.random() * colores.length)];
        c.style.background = col;
        c.style.boxShadow  = `0 0 8px ${col}, 0 0 3px #fff`;
        cont.appendChild(c);
    }
}

/* ── Canvas brillos por sección ── */
function iniciarBrillosCanvas() {
    document.querySelectorAll(".brillo-canvas").forEach(canvas => {
        const sec = canvas.parentElement;
        canvas.width  = sec.offsetWidth  || window.innerWidth;
        canvas.height = sec.offsetHeight || window.innerHeight;

        const ctx = canvas.getContext("2d");
        const estrellas = [];
        const TOTAL = 60;
        const colores = ["#c084fc","#e9d5ff","#ffffff","#a855f7","#d8b4fe","#d4af37"];

        for (let i = 0; i < TOTAL; i++) estrellas.push(nueva(canvas.width, canvas.height, colores));

        function nueva(w, h, cols) {
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.8 + 0.4,
                alpha: Math.random(),
                dAlpha: (Math.random() * 0.012 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
                dy: -(Math.random() * 0.4 + 0.05),
                color: cols[Math.floor(Math.random() * cols.length)],
            };
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            estrellas.forEach((s, i) => {
                s.y += s.dy; s.alpha += s.dAlpha;
                if (s.alpha >= 1) { s.alpha = 1; s.dAlpha *= -1; }
                if (s.alpha <= 0) {
                    estrellas[i] = nueva(canvas.width, canvas.height, colores);
                    estrellas[i].y = canvas.height + 5; return;
                }
                ctx.save();
                ctx.globalAlpha = s.alpha;
                ctx.fillStyle   = s.color;
                ctx.shadowColor = s.color;
                ctx.shadowBlur  = s.r * 7;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
                if (s.r > 1.4) {
                    ctx.strokeStyle = s.color; ctx.lineWidth = 0.5;
                    ctx.globalAlpha = s.alpha * 0.55;
                    const l = s.r * 5;
                    ctx.beginPath();
                    ctx.moveTo(s.x-l, s.y); ctx.lineTo(s.x+l, s.y);
                    ctx.moveTo(s.x, s.y-l); ctx.lineTo(s.x, s.y+l);
                    ctx.stroke();
                }
                ctx.restore();
            });
            requestAnimationFrame(draw);
        }
        draw();
    });
}

/* ── Intersection Observer (entrada al scroll) ── */
function iniciarObservadorEntrada() {
    const root = document.getElementById("invitacion-final");
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), 160);
            else e.target.classList.remove("visible");
        });
    }, { threshold: 0.22, root });

    document.querySelectorAll(".anim-entrada").forEach(el => obs.observe(el));
}

/* ── Contador regresivo ── */
function actualizarContador() {
    const diff = new Date("April 18, 2026 17:00:00") - new Date();
    const elDias = document.getElementById("c-dias");
    if (!elDias) return;
    if (diff <= 0) {
        document.getElementById("timer").innerHTML = "<span style='color:#e9d5ff;font-size:1rem;font-family:Cinzel Decorative'>¡ES HOY! 🦋</span>";
        return;
    }
    const pad = n => String(n).padStart(2, "0");
    elDias.textContent                             = pad(Math.floor(diff / 86400000));
    document.getElementById("c-horas").textContent = pad(Math.floor((diff % 86400000) / 3600000));
    document.getElementById("c-min").textContent   = pad(Math.floor((diff % 3600000) / 60000));
    document.getElementById("c-seg").textContent   = pad(Math.floor((diff % 60000) / 1000));
}
setInterval(actualizarContador, 1000);
actualizarContador();