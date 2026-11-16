/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyB45I1lwpPZmUJxFB5hu_xtXAW709PPxc",
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

const params = new URLSearchParams(window.location.search);
const invId = params.get("id");
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
========================= */

const DESTINOS = {
    "mar-gera-mro6": "https://demir.com.mx/invitacion/mar-gera/",
    "den-mt9j": "https://www.invitaciones.demir.com.mx/marioden",
    "flor-daniel-muu8": "https://www.invitaciones.demir.com.mx/flordaniel"
};


/* =========================
   CONTEXTO PARA EL RSVP
========================= */

function guardarContextoRSVP() {
    try {
        const contexto = encodeURIComponent(JSON.stringify({
            id: invId,
            evento: eventoId,
            guardadoEn: Date.now()
        }));

        document.cookie =
            `demir_rsvp_context=${contexto}; Domain=.demir.com.mx; Path=/; Max-Age=86400; SameSite=Lax; Secure`;

    } catch (e) {
        console.warn("No fue posible guardar el contexto RSVP:", e);
    }
}

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

        guardarContextoRSVP();

        nombreInvitado.textContent = inv.nombre || "";

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

sello.disabled = true;
cargarInvitado();


/* =========================
   ABRIR SOBRE
========================= */

sello.addEventListener("click", () => {

    sello.disabled = true;
    sello.querySelector("img").style.animation = "none";
    solapa.style.transform = "rotateX(180deg)";
    sello.style.opacity = "0";

    setTimeout(() => {

        sobre.classList.add("desapareciendo");

        setTimeout(() => {
            sobre.style.display = "none";
            tarjetaContainer.classList.add("visible");
        }, 650);

    }, 1000);

});


/* =========================
   ABRIR INVITACIÓN
========================= */

abrirInvitacion.addEventListener("click", () => {

    tarjetaContainer.classList.add("saliendo");

    setTimeout(() => {

        tarjetaContainer.style.display = "none";
        videoContainer.style.display = "flex";

        setTimeout(() => {

            videoContainer.style.opacity = "1";
            video.play();

            let ultimoTiempo = -1;
            let segundosSinAvance = 0;

            const vigilante = setInterval(() => {

                if (videoTerminado) {
                    clearInterval(vigilante);
                    return;
                }

                if (video.ended) {
                    manejarFinVideo();
                    return;
                }

                if (video.currentTime === ultimoTiempo) {
                    segundosSinAvance++;
                } else {
                    segundosSinAvance = 0;
                    ultimoTiempo = video.currentTime;
                }

                if (segundosSinAvance >= 12) {
                    manejarFinVideo();
                }

            }, 1000);

        }, 50);

    }, 650);

});


/* =========================
   IR A LA INVITACIÓN
========================= */

const tapContinuar = document.getElementById("tapContinuar");
let yaRedirigido = false;

function irAInvitacion() {

    if (yaRedirigido) return;

    yaRedirigido = true;

    if (datosListos) {
        guardarContextoRSVP();
    }

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

    setTimeout(irAInvitacion, 2200);

    setTimeout(() => {
        tapContinuar.style.display = "block";
    }, 3200);

}


/* =========================
   FIN DEL VIDEO
========================= */

video.addEventListener("ended", manejarFinVideo);

video.addEventListener("timeupdate", () => {

    if (video.duration && video.currentTime >= video.duration - 0.35) {
        manejarFinVideo();
    }

});

video.addEventListener("error", () => {
    console.error("Error al cargar/reproducir el video");
});
