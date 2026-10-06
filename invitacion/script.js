/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyB45I1lwpPZmUJxFB5hu_xtXAwX709PPxc",
  authDomain: "demirqr-cb84d.firebaseapp.com",
  databaseURL: "https://demirqr-cb84d-default-rtdb.firebaseio.com",
  projectId: "demirqr-cb84d",
  storageBucket: "demirqr-cb84d.appspot.com",
  messagingSenderId: "172090319379",
  appId: "1:172090319379:web:b9577cb84f0e6c2c4495e6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();


/* =========================
   LEER PARÁMETROS DE LA URL
========================= */

const params   = new URLSearchParams(window.location.search);
const invId    = params.get("id");
const eventoId = params.get("evento");


/* =========================
   ELEMENTOS
========================= */

const sello = document.getElementById("sello");
const sobre = document.getElementById("sobre");
const solapa = document.querySelector(".solapa");

const tarjetaContainer = document.getElementById("tarjetaContainer");
const abrirInvitacion = document.getElementById("abrirInvitacion");
const nombreInvitado = document.getElementById("nombreInvitado");
const numeroPase = document.getElementById("numeroPase");

const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("video");


/* =========================
   URL DE DESTINO POR EVENTO
   (a dónde redirige cada boda
   al terminar el video)
========================= */

const DESTINOS = {
    "mar-gera-mro6": "https://demir.com.mx/invitacion/mar-gera/",
    "den-mt9j": "https://www.invitaciones.demir.com.mx/marioden",
    "flor-daniel-muu8": "https://www.invitaciones.demir.com.mx/flordaniel"
    // Agregar aquí futuras bodas:
    // "otro-evento-id": "https://demir.com.mx/invitacion/otra-boda/"
};


/* =========================
   CARGAR DATOS DEL INVITADO
========================= */

let datosListos = false;

async function cargarInvitado() {

    if (!invId || !eventoId) {
        mostrarErrorCarga("Este enlace no es válido. Por favor contacta a tu organizadora.");
        return;
    }

    try {

        const snap = await db.ref(`invitados/${eventoId}/${invId}`).once("value");
        const inv = snap.val();

        if (!inv) {
            mostrarErrorCarga("No encontramos tu invitación. Por favor contacta a tu organizadora.");
            return;
        }

        /* Nombre */
        nombreInvitado.textContent = inv.nombre || "";

        /* Número de pases: "acompanantes" es texto con nombres
           separados por coma (ej. "Sofía, Mateo"), no un número.
           Contamos cuántos nombres hay y sumamos al titular.
           Si además existe un campo manual ("#" o "pases") que sea
           mayor, respetamos ese como el total real. */
        const textoAcomp = (inv.acompanantes || "").trim();
        const numAcompanantes = textoAcomp
            ? textoAcomp.split(",").map(s => s.trim()).filter(Boolean).length
            : 0;

        const manual = parseInt(inv["#"]) || parseInt(inv.pases) || 0;
        const totalPases = Math.max(manual, 1 + numAcompanantes);

        numeroPase.textContent = totalPases === 1
            ? "1 persona"
            : `${totalPases} personas`;

        datosListos = true;

        /* Habilitar el sello solo cuando ya tenemos datos */
        sello.disabled = false;

    } catch (e) {
        console.error(e);
        mostrarErrorCarga("Ocurrió un error al cargar tu invitación. Intenta de nuevo.");
    }
}

function mostrarErrorCarga(mensaje) {
    nombreInvitado.textContent = mensaje;
    numeroPase.textContent = "";
    abrirInvitacion.style.display = "none";
}

/* El sello arranca deshabilitado hasta confirmar que
   hay datos válidos del invitado */
sello.disabled = true;
cargarInvitado();


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

            /* Respaldo absoluto: si el video no reporta bien
               su duración/fin (pasa con ciertos formatos en
               algunos Android), esto garantiza avanzar de
               todas formas, sin depender de ningún evento
               del video. */
            setTimeout(manejarFinVideo, 6000);

        }, 50);

    }, 650);

});


/* =========================
   CUANDO TERMINA EL VIDEO
========================= */

/* =========================
   IR A LA INVITACIÓN
========================= */

const tapContinuar = document.getElementById("tapContinuar");
let yaRedirigido = false;

function irAInvitacion() {

    if (yaRedirigido) return;
    yaRedirigido = true;

    const destinoBase = DESTINOS[eventoId] || "https://demir.com.mx/";
    const destino = `${destinoBase}?id=${encodeURIComponent(invId)}&evento=${encodeURIComponent(eventoId)}`;

    console.log("Redirigiendo a:", destino);

    window.location.replace(destino);
}

tapContinuar.addEventListener("click", irAInvitacion);


let videoTerminado = false;

function manejarFinVideo() {

    if (videoTerminado) return;
    videoTerminado = true;

    videoContainer.classList.add("fade-out");

    /* Intento automático */
    setTimeout(irAInvitacion, 2200);

    /* Respaldo visual: si el navegador bloqueó la
       redirección automática (ocurre en algunos
       móviles), aparece un botón para continuar
       manualmente con un solo toque */
    setTimeout(() => {
        tapContinuar.style.display = "block";
    }, 3200);
}


/* =========================
   CUANDO TERMINA EL VIDEO
========================= */

video.addEventListener("ended", manejarFinVideo);

/* Respaldo: algunos videos (según cómo fueron exportados)
   no disparan el evento "ended" de forma confiable en
   ciertos navegadores móviles. Detectamos también cuando
   el tiempo actual está muy cerca de la duración total. */
video.addEventListener("timeupdate", () => {

    if (video.duration && video.currentTime >= video.duration - 0.35) {
        manejarFinVideo();
    }

});

video.addEventListener("error", () => {
    console.error("Error al cargar/reproducir el video");
});
