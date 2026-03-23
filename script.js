function detonarMagia() {
    // Iniciar Música
    const cancion = document.getElementById("musica");
    if (cancion) { 
        cancion.volume = 0.5;
        cancion.play().catch(e => console.log("Música activada")); 
    }

    // Iniciar Chispas
    crearChispas(25); 

    const tl = gsap.timeline();
    tl.to("#wrapper-sobre", { 
        scale: 3, opacity: 0, duration: 1, ease: "power2.in",
        onComplete: () => { document.getElementById("wrapper-sobre").style.display = "none"; }
    })
    .set("#capa-gato", { display: "flex", opacity: 0 })
    .to("#capa-gato", { opacity: 1, duration: 1 })
    .to("#capa-gato", { 
        opacity: 0, duration: 0.8, delay: 1.5,
        onComplete: () => { document.getElementById("capa-gato").style.display = "none"; }
    })
    .set("#invitacion-final", { display: "block", opacity: 0 })
    .to("#invitacion-final", { opacity: 1, duration: 1.2 });
}

function crearChispas(cant) {
    const cont = document.getElementById("particulas-container");
    for (let i = 0; i < cant; i++) {
        const c = document.createElement("div");
        c.className = "chispa";
        c.style.left = Math.random() * 100 + "vw";
        c.style.top = Math.random() * 100 + "vh";
        c.style.animationDelay = Math.random() * 4 + "s";
        cont.appendChild(c);
    }
}

function actualizarContador() {
    const fechaEvento = new Date("April 18, 2026 17:00:00").getTime();
    const ahora = new Date().getTime();
    const diferencia = fechaEvento - ahora;

    if (diferencia <= 0) {
        document.getElementById("timer").innerHTML = "¡ES HOY!";
        return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById("timer").innerHTML = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}

setInterval(actualizarContador, 1000);
actualizarContador();