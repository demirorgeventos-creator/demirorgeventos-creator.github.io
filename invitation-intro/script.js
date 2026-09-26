const sello = document.getElementById("sello");
const sobre = document.getElementById("sobre");
const solapa = document.querySelector(".solapa");

const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("video");


/* =========================
   ABRIR SOBRE
========================= */

sello.addEventListener("click", () => {

    /* Evita que se pueda pulsar varias veces */
    sello.disabled = true;


    /* Abrir la solapa */

    solapa.style.transform = "rotateX(180deg)";


    /* Desaparecer el sello */

    sello.style.opacity = "0";


    /*
       Esperamos a que termine
       la animación del sobre
    */

    setTimeout(() => {

        /* Ocultar sobre */

        sobre.style.display = "none";


        /* Mostrar contenedor del video */

        videoContainer.style.display = "flex";


        /*
           Pequeña espera para permitir
           que CSS detecte el cambio
           y haga el fade correctamente
        */

        setTimeout(() => {

            videoContainer.style.opacity = "1";

        }, 50);


        /* Reproducir video */

        video.play();

    }, 1000);

});


/* =========================
   CUANDO TERMINA EL VIDEO
========================= */

video.addEventListener("ended", () => {

    /*
       Comienza el fade-out
    */

    videoContainer.classList.add("fade-out");


    /*
       Esperamos a que termine
       la transición y después
       vamos a la invitación
    */

    setTimeout(() => {

        window.location.href = "https://google.com";

    }, 2200);

});
