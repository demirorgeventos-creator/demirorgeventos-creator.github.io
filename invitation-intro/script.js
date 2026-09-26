// =========================
// ELEMENTOS
// =========================

const sello = document.getElementById("sello");
const sobre = document.getElementById("sobre");
const solapa = document.querySelector(".solapa");

const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("video");

const final = document.getElementById("final");
const continuar = document.getElementById("continuar");


// =========================
// ABRIR SOBRE
// =========================

sello.addEventListener("click", () => {

    // Evitamos que se pueda pulsar varias veces
    sello.disabled = true;

    // Abrimos la solapa
    solapa.style.transform = "rotateX(180deg)";

    // Ocultamos el sello
    sello.style.opacity = "0";

    // Esperamos a que termine la animación
    setTimeout(() => {

        // Ocultamos completamente el sobre
        sobre.style.display = "none";

        // Mostramos el video
        videoContainer.style.display = "flex";

        // Pequeña transición de entrada
        setTimeout(() => {
            videoContainer.style.opacity = "1";
        }, 50);

        // Intentamos reproducir el video
        video.play();

    }, 1000);

});
// =========================
// CUANDO TERMINA EL VIDEO
// =========================

video.addEventListener("ended", () => {

    // El video comienza a desvanecerse
    videoContainer.classList.add("fade-out");

    setTimeout(() => {

        // AQUÍ PONDREMOS EL LINK REAL DE LA INVITACIÓN
        window.location.href = "https://google.com";

    }, 1200);

});

    // AQUÍ DESPUÉS PONDREMOS
    // EL LINK REAL DE LA INVITACIÓN

    window.location.href = "https://google.com";

});
