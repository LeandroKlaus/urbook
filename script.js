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
    // Esta função agora é controlada principalmente por handleOrientationChange,
    // mas a mantemos para a lógica de virar a página.
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

function goNextPage() {
    if (currentLocation < maxLocation) {
        if (currentLocation === 1) {
            openBook();
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


// --- INÍCIO DA SEÇÃO MODIFICADA ---

let volumeFadeInterval;
const orientationPrompt = document.querySelector("#orientation-prompt");

function handleOrientationChange() {
    clearInterval(volumeFadeInterval);

    // Verifica a orientação comparando largura e altura da janela
    const isLandscape = window.innerWidth > window.innerHeight;

    if (isLandscape) {
        // MODO PAISAGEM
        orientationPrompt.style.display = 'none';
        book.style.display = 'block';
        updateButtons(); // Atualiza os botões com base na página atual

        // Fade in da música
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

        // Fade out da música
        const fadeOutDuration = 2000; // Fade out mais rápido
        const stepTime = 50;
        const currentVolume = backgroundMusic.volume;
        const totalSteps = fadeOutDuration / stepTime;
        const volumeStep = currentVolume / totalSteps;

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
    }
}

// Adiciona um ouvinte de evento para o redimensionamento da janela
window.addEventListener('resize', handleOrientationChange);

// Executa a função uma vez no carregamento da página para definir o estado inicial
document.addEventListener('DOMContentLoaded', handleOrientationChange);