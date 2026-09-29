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
    "mar-gera-mro6": "https://demir.com.mx/invitacion/mar-gera/"
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

        /* Número de pases: mismo criterio que la agenda —
           el mayor entre el campo manual y 1 + acompañantes */
        const acompanantes = parseInt(inv.acompanantes) || 0;
        const manual = parseInt(inv["#"]) || parseInt(inv.pases) || 0;
        const totalPases = Math.max(manual, 1 + acompanantes);

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

        }, 50);

    }, 650);

});


/* =========================
   CUANDO TERMINA EL VIDEO
========================= */

video.addEventListener("ended", () => {

    videoContainer.classList.add("fade-out");

    setTimeout(() => {

        /* Redirige a la invitación real de esta boda,
           pasando los mismos id y evento para que la
           invitación también pueda saber quién es el invitado */

        const destinoBase = DESTINOS[eventoId] || "https://demir.com.mx/";
        const destino = `${destinoBase}?id=${encodeURIComponent(invId)}&evento=${encodeURIComponent(eventoId)}`;

        window.location.href = destino;

    }, 2200);

});
