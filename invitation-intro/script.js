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

    /* Detener el latido */
    sello.querySelector("img").style.animation = "none";

    /* Abrir la solapa */
    solapa.style.transform = "rotateX(180deg)";

    /* Desaparecer el sello */
    sello.style.opacity = "0";


    /*
       Esperamos a que termine
       la apertura de la solapa.
    */

    setTimeout(() => {

        /*
           El sobre desaparece
           suavemente.
        */

        sobre.classList.add("desapareciendo");


        /*
           Esperamos parte de la
           desaparición para que
           no haya un corte brusco.
        */

        setTimeout(() => {

            sobre.style.display = "none";


            /*
               Ahora aparece la tarjeta.
            */

            tarjetaContainer.classList.add("visible");

        }, 650);

    }, 1000);

});


/* =========================
   ABRIR INVITACIÓN
========================= */

abrirInvitacion.addEventListener("click", () => {

    /*
       Primero desaparece la tarjeta.
    */

    tarjetaContainer.classList.add("saliendo");


    /*
       Después aparece el video.
    */

    setTimeout(() => {

        tarjetaContainer.style.display = "none";

        videoContainer.style.display = "flex";


        /*
           Damos un pequeño margen para
           que el navegador registre la
           transición de opacidad.
        */

        setTimeout(() => {

            videoContainer.style.opacity = "1";

            video.play();

        }, 50);

    }, 650);

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
