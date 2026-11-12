(() => {
const audio = document.getElementById('musica');
const button = document.getElementById('controlMusica');
const progreso = document.getElementById('progreso');
const tiempoActual = document.getElementById('tiempoActual');
const duracion = document.getElementById('duracion');
const volumen = document.getElementById('volumen');

function formatoTiempo(segundos) {
if (!Number.isFinite(segundos)) return '00:00';

const minutos = Math.floor(segundos / 60);
const segundosRestantes = Math.floor(segundos % 60);

return String(minutos).padStart(2, '0') + ':' +
       String(segundosRestantes).padStart(2, '0');

}

function actualizarBoton() {
const reproduciendo = !audio.paused;

button.classList.toggle('is-playing', reproduciendo);
button.setAttribute(
  'aria-label',
  reproduciendo ? 'Pausar música' : 'Reproducir música'
);

}

button.addEventListener('click', async () => {
if (audio.paused) {
try {
await audio.play();
} catch (error) {
actualizarBoton();
}
} else {
audio.pause();
}

actualizarBoton();

});

audio.addEventListener('loadedmetadata', () => {
duracion.textContent = formatoTiempo(audio.duration);
progreso.max = Number.isFinite(audio.duration) ? audio.duration : 100;
});

audio.addEventListener('timeupdate', () => {
if (!audio.duration) return;

progreso.value = audio.currentTime;
tiempoActual.textContent = formatoTiempo(audio.currentTime);

});

progreso.addEventListener('input', () => {
if (Number.isFinite(audio.duration)) {
audio.currentTime = Number(progreso.value);
}
});

volumen.addEventListener('input', () => {
audio.volume = Number(volumen.value);
audio.muted = audio.volume === 0;
});

audio.addEventListener('play', actualizarBoton);
audio.addEventListener('pause', actualizarBoton);
audio.addEventListener('ended', actualizarBoton);

audio.volume = 1;
actualizarBoton();
})();
