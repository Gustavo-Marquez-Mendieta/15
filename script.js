function detonarMagia() {
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

// LÓGICA DEL CONTADOR (Asegúrate que la fecha sea futura)
function actualizarContador() {
    // Fecha: 18 de Abril de 2026 (ajusta el año si es necesario)
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

// Ejecutar cada segundo
setInterval(actualizarContador, 1000);
actualizarContador(); // Carga inicial