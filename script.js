function detonarMagia() {
    const cancion = document.getElementById("musica");
    if (cancion) { cancion.volume = 0.5; cancion.play().catch(()=>{}); }

    crearChispas(40);

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
        c.style.boxShadow  = `0 0 6px ${col}`;
        cont.appendChild(c);
    }
}

/* ── Canvas brillos — solo sección visible ── */
function iniciarBrillosCanvas() {
    const colores = ["#c084fc","#e9d5ff","#ffffff","#a855f7","#d8b4fe","#d4af37"];
    const TOTAL   = 30; // reducido de 60 a 30 por sección
    const scroll  = document.getElementById("invitacion-final");

    // Guardamos el estado de cada canvas
    const canvasData = [];

    document.querySelectorAll(".brillo-canvas").forEach((canvas, idx) => {
        const sec = canvas.parentElement;
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext("2d");
        const estrellas = [];

        for (let i = 0; i < TOTAL; i++) estrellas.push(nuevaEstrella(canvas.width, canvas.height, colores));

        canvasData.push({ canvas, ctx, estrellas, activo: false, rafId: null });
    });

    function nuevaEstrella(w, h, cols) {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.6 + 0.4,
            alpha: Math.random(),
            dAlpha: (Math.random() * 0.010 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
            dy: -(Math.random() * 0.3 + 0.04),
            color: cols[Math.floor(Math.random() * cols.length)],
        };
    }

    function dibujarCanvas(data) {
        const { canvas, ctx, estrellas } = data;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < estrellas.length; i++) {
            const s = estrellas[i];
            s.y += s.dy;
            s.alpha += s.dAlpha;

            if (s.alpha >= 1)  { s.alpha = 1; s.dAlpha *= -1; }
            if (s.alpha <= 0)  {
                estrellas[i] = nuevaEstrella(canvas.width, canvas.height, colores);
                estrellas[i].y = canvas.height + 5;
                continue;
            }

            ctx.save();
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle   = s.color;
            ctx.shadowColor = s.color;
            ctx.shadowBlur  = s.r * 5;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();

            // Cruz solo para estrellas grandes
            if (s.r > 1.3) {
                ctx.strokeStyle = s.color;
                ctx.lineWidth   = 0.5;
                ctx.globalAlpha = s.alpha * 0.5;
                const l = s.r * 4;
                ctx.beginPath();
                ctx.moveTo(s.x - l, s.y); ctx.lineTo(s.x + l, s.y);
                ctx.moveTo(s.x, s.y - l); ctx.lineTo(s.x, s.y + l);
                ctx.stroke();
            }
            ctx.restore();
        }

        if (data.activo) {
            data.rafId = requestAnimationFrame(() => dibujarCanvas(data));
        }
    }

    // IntersectionObserver: solo anima el canvas visible
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const canvas = entry.target;
            const data   = canvasData.find(d => d.canvas === canvas);
            if (!data) return;

            if (entry.isIntersecting) {
                if (!data.activo) {
                    data.activo = true;
                    dibujarCanvas(data);
                }
            } else {
                data.activo = false;
                if (data.rafId) cancelAnimationFrame(data.rafId);
                // Limpiar canvas invisible para liberar GPU
                data.ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
            }
        });
    }, { threshold: 0.05, root: scroll });

    canvasData.forEach(d => obs.observe(d.canvas));
}

/* ── Intersection Observer entrada ── */
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
    const diff = new Date("April 25, 2026 17:00:00") - new Date();
    const elDias = document.getElementById("c-dias");
    if (!elDias) return;
    if (diff <= 0) {
        document.getElementById("timer").innerHTML =
            "<span style='color:#e9d5ff;font-size:1rem;font-family:Cinzel Decorative'>¡ES HOY! 🦋</span>";
        return;
    }
    const pad = n => String(n).padStart(2, "0");
    elDias.textContent                              = pad(Math.floor(diff / 86400000));
    document.getElementById("c-horas").textContent = pad(Math.floor((diff % 86400000) / 3600000));
    document.getElementById("c-min").textContent   = pad(Math.floor((diff % 3600000)  / 60000));
    document.getElementById("c-seg").textContent   = pad(Math.floor((diff % 60000)    / 1000));
}
setInterval(actualizarContador, 1000);
actualizarContador();