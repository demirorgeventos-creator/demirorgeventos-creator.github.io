const sello = document.getElementById("sello");
const sobre = document.getElementById("sobre");
const solapa = document.querySelector(".solapa");

const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("video");


/* =========================
   ABRIR SOBRE
========================= */

sello.addEventListener("click", () => {

    sello.disabled = true;

    solapa.style.transform = "rotateX(180deg)";
    sello.style.opacity = "0";

    setTimeout(() => {

        sobre.style.display = "none";

        videoContainer.style.display = "flex";

        setTimeout(() => {
            videoContainer.style.opacity = "1";
        }, 50);

        video.play();

    }, 1000);

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
