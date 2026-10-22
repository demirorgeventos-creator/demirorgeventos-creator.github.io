(() => {
  const audio = document.getElementById('musica');
  const button = document.getElementById('controlMusica');
  const status = document.getElementById('estado');

  function updatePlaying(isPlaying) {
    button.classList.toggle('is-playing', isPlaying);
    button.setAttribute('aria-pressed', String(isPlaying));
    button.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproducir música');
    status.textContent = isPlaying ? 'Música reproduciéndose' : 'Música pausada';
  }

  async function playMusic() {
    try {
      await audio.play();
      updatePlaying(true);
    } catch (error) {
      // El navegador puede bloquear el autoplay con sonido.
      updatePlaying(false);
      status.textContent = 'Toca el botón para reproducir la música';
    }
  }

  button.addEventListener('click', async () => {
    if (audio.paused) {
      await playMusic();
    } else {
      audio.pause();
      updatePlaying(false);
    }
  });

  audio.addEventListener('play', () => updatePlaying(true));
  audio.addEventListener('pause', () => updatePlaying(false));
  audio.addEventListener('ended', () => updatePlaying(false));

  // Se intenta reproducir al cargar; si el navegador lo bloquea,
  // el invitado puede iniciar la canción tocando el botón.
  window.addEventListener('load', playMusic);
})();
