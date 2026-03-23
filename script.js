function detonarMagia() {
    const tl = gsap.timeline();

    // 1. ZOOM EQUILIBRADO (Ideal para celular)
    tl.to("#wrapper-sobre", { 
        scale: 4, 
        opacity: 0, 
        duration: 1.2, 
        ease: "power2.inOut" 
    })
    
    // 2. EL GATO (Ajustado)
    .set("#wrapper-sobre", { display: "none" })
    .set("#capa-gato", { display: "flex", opacity: 0 })
    .to("#capa-gato", { opacity: 1, duration: 1 })
    .to("#capa-gato", { opacity: 0, duration: 0.8, delay: 1.2 })
    
    // 3. REVELAR PLANILLAS
    .set("#capa-gato", { display: "none" })
    .set("#invitacion-final", { display: "block", opacity: 0 })
    .to("#invitacion-final", { 
        opacity: 1, 
        duration: 1,
        onComplete: () => {
            // Permitir scroll solo cuando termine la animación
            document.body.style.overflowY = "auto";
        }
    });
}