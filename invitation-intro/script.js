const sello = document.getElementById("sello");
const sobre = document.getElementById("sobre");
const solapa = document.querySelector(".solapa");

const tarjetaContainer = document.getElementById("tarjetaContainer");
const abrirInvitacion = document.getElementById("abrirInvitacion");

const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("video");


/* =========================
   ABRIR SOBRE
========================= */

sello.addEventListener("click", () => {

    sello.disabled = true;

    /* Detenemos visualmente el latido */
    sello.querySelector("img").style.animation = "none";

    /* Abrimos la solapa */
    solapa.style.transform = "rotateX(180deg)";

    /* Desaparece el sello */
    sello.style.opacity = "0";


    /* =========================
       DESPUÉS DE ABRIR
    ========================== */

    setTimeout(() => {

        /* El sobre comienza a desaparecer */
        sobre.classList.add("desapareciendo");


        /* Esperamos a que desaparezca */
        setTimeout(() => {

            sobre.style.display = "none";

            /* =========================
               APARECE LA TARJETA
            ========================== */

            tarjetaContainer.classList.add("visible");

        }, 650);

    }, 1000);

});


/* =========================
   ABRIR INVITACIÓN
========================= */

abrirInvitacion.addEventListener("click", () => {

    /* La tarjeta desaparece */
    tarjetaContainer.classList.add("saliendo");


    /* Después aparece el video */
    setTimeout(() => {

        tarjetaContainer.style.display = "none";

        videoContainer.style.display = "flex";

        setTimeout(() => {

            videoContainer.style.opacity = "1";

            video.play();

        }, 50);

    }, 700);

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
