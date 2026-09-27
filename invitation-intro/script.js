const sello = document.getElementById("sello");
const sobre = document.getElementById("sobre");

const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("video");


/* =========================
   ABRIR SOBRE
========================= */

sello.addEventListener("click", () => {

    sello.disabled = true;

    /* Inicia toda la animación */
    sobre.classList.add("abriendo");


    /*
        Esperamos a que la solapa termine
        de abrirse antes de retirar el sobre.
    */

    setTimeout(() => {

        sobre.style.opacity = "0";
        sobre.style.transform =
            "translateY(-10px) scale(0.98)";

    }, 1350);


    /*
        Una vez que el sobre ya desapareció,
        mostramos el video.
    */

    setTimeout(() => {

        sobre.style.display = "none";

        videoContainer.style.display = "flex";

        setTimeout(() => {
            videoContainer.style.opacity = "1";
        }, 50);

        video.play();

    }, 2150);

});


/* =========================
   CUANDO TERMINA EL VIDEO
========================= */

video.addEventListener("ended", () => {

    videoContainer.classList.add("fade-out");

    setTimeout(() => {

        window.location.href = "https://google.com";

    }, 2200);

});
