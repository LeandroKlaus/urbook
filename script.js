const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const restartBtn = document.querySelector("#restart-btn");
const book = document.querySelector("#book");
const papers = document.querySelectorAll(".paper");
const backgroundMusic = document.querySelector("#background-music");

const numOfPapers = papers.length;
const maxLocation = numOfPapers + 1;
let currentLocation = 1;

function updateButtons() {
    if (currentLocation === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }

    if (currentLocation > numOfPapers) {
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        restartBtn.style.display = 'none';
    }
}

function resetZIndex() {
    for (let i = 0; i < numOfPapers; i++) {
        papers[i].style.zIndex = numOfPapers - i;
    }
}

resetZIndex();
updateButtons();

nextBtn.addEventListener("click", goNextPage);
prevBtn.addEventListener("click", goPrevPage);
restartBtn.addEventListener("click", goInitialState);

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari e Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari e Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}


function goNextPage() {
    if (currentLocation < maxLocation) {
        if (currentLocation === 1) {
            openBook();
            if (!document.fullscreenElement) {
                enterFullscreen(document.documentElement);
            }
        }

        papers[currentLocation - 1].classList.add("flipped");
        
        const pageToFlipIndex = currentLocation - 1;
        setTimeout(() => {
            papers[pageToFlipIndex].style.zIndex = pageToFlipIndex + 1;
        }, 100);

        if (currentLocation === numOfPapers) {
            closeBook(false);
        }
        
        currentLocation++;
        updateButtons();
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        currentLocation--;
        
        if (currentLocation === numOfPapers) {
             openBook(false);
        }

        papers[currentLocation - 1].classList.remove("flipped");
        
        const pageToUnflipIndex = currentLocation - 1;
        setTimeout(() => {
            papers[pageToUnflipIndex].style.zIndex = numOfPapers - pageToUnflipIndex;
        }, 100);

        if (currentLocation === 1) {
            closeBook(true);
        }
        
        updateButtons();
    }
}

function goInitialState() {
    let i = numOfPapers;
    const interval = setInterval(() => {
        if (i > 0) {
            papers[i - 1].classList.remove("flipped");
            i--;
        } else {
            clearInterval(interval);
            
            resetZIndex();

            currentLocation = 1;
            closeBook(true);
            updateButtons();
        }
    }, 150);
}

function openBook() {
    book.style.transform = "translateX(50%)";
}

function closeBook(isAtBeginning) {
    if (isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
}

let volumeFadeInterval;
const orientationPrompt = document.querySelector("#orientation-prompt");

function handleOrientationChange() {
    clearInterval(volumeFadeInterval);

    const isLandscape = screen.orientation.type.includes('landscape');

    if (isLandscape) {
        // MODO PAISAGEM: Fade-in da música
        orientationPrompt.style.display = 'none';
        book.style.display = 'block';
        updateButtons(); 

        const fadeInDuration = 5000;
        const stepTime = 50;
        const totalSteps = fadeInDuration / stepTime;
        const volumeStep = 1.0 / totalSteps;

        if (backgroundMusic.paused) {
            backgroundMusic.volume = 0;
            backgroundMusic.play().catch(error => {
                console.log("A reprodução automática foi bloqueada. A música começará na primeira interação do usuário.");
            });
        }
        
        volumeFadeInterval = setInterval(() => {
            let newVolume = backgroundMusic.volume + volumeStep;
            if (newVolume >= 1.0) {
                backgroundMusic.volume = 1.0;
                clearInterval(volumeFadeInterval);
            } else {
                backgroundMusic.volume = newVolume;
            }
        }, stepTime);

    } else {
        // MODO RETRATO
        orientationPrompt.style.display = 'flex';
        book.style.display = 'none';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        if(restartBtn) {
            restartBtn.style.display = 'none';
        }

        // MODIFICADO: Lógica de fade-out restaurada para a música
        const fadeOutDuration = 2000;
        const stepTime = 50;
        const currentVolume = backgroundMusic.volume;
        // Evita divisão por zero se o volume já for 0
        const totalSteps = fadeOutDuration / stepTime;
        const volumeStep = currentVolume > 0 ? currentVolume / totalSteps : 0;

        volumeFadeInterval = setInterval(() => {
            let newVolume = backgroundMusic.volume - volumeStep;
            if (newVolume <= 0) {
                backgroundMusic.volume = 0;
                backgroundMusic.pause();
                clearInterval(volumeFadeInterval);
            } else {
                backgroundMusic.volume = newVolume;
            }
        }, stepTime);

        // Sai da tela cheia automaticamente
        if (document.fullscreenElement) {
            exitFullscreen();
        }
    }
}

screen.orientation.addEventListener('change', handleOrientationChange);

document.addEventListener('DOMContentLoaded', handleOrientationChange);