const audio = document.getElementById("audio");
const play = document.getElementById("play");
const barra = document.getElementById("barra");
const tiempo = document.getElementById("tiempo");

play.addEventListener("click", () => {

    if (audio.paused) {
        audio.play();
        play.innerHTML = "❚❚";
    } else {
        audio.pause();
        play.innerHTML = "▶";
    }

});


audio.addEventListener("loadedmetadata", () => {
    barra.max = audio.duration;
    actualizarTiempo();
});


audio.addEventListener("timeupdate", () => {
    barra.value = audio.currentTime;
    actualizarTiempo();
});


barra.addEventListener("input", () => {
    audio.currentTime = barra.value;
});


audio.addEventListener("ended", () => {
    play.innerHTML = "▶";
});


function actualizarTiempo(){

    let actual = convertirTiempo(audio.currentTime);
    let total = convertirTiempo(audio.duration);

    tiempo.innerHTML = actual + " / " + total;

}


function convertirTiempo(segundos){

    if (isNaN(segundos)) {
        return "0:00";
    }

    let minutos = Math.floor(segundos / 60);
    let segundosRestantes = Math.floor(segundos % 60);

    if (segundosRestantes < 10){
        segundosRestantes = "0" + segundosRestantes;
    }

    return minutos + ":" + segundosRestantes;
}
