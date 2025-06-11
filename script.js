// Selecionando os elementos do DOM
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const restartBtn = document.querySelector("#restart-btn");
const book = document.querySelector("#book");
const papers = document.querySelectorAll(".paper");

// Configuração inicial
const numOfPapers = papers.length;
const maxLocation = numOfPapers + 1;
let currentLocation = 1;

// --- FUNÇÃO PARA ATUALIZAR A VISIBILIDADE DOS BOTÕES ---
function updateButtons() {
    // Esconde o botão de voltar na capa
    if (currentLocation === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }

    // Troca o botão de próximo pelo de reiniciar na última página
    if (currentLocation >= numOfPapers) {
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        restartBtn.style.display = 'none';
    }
}

// --- NOVA FUNÇÃO PARA RESETAR AS CAMADAS ---
// Esta função garante que a ordem das páginas (z-index) esteja sempre correta no início.
function resetZIndex() {
    for (let i = 0; i < numOfPapers; i++) {
        papers[i].style.zIndex = numOfPapers - i;
    }
}

// Chamadas iniciais para garantir que o livro comece certo
resetZIndex();
updateButtons(); // Garante que os botões estejam no estado correto no início

// Event Listeners
nextBtn.addEventListener("click", goNextPage);
prevBtn.addEventListener("click", goPrevPage);
restartBtn.addEventListener("click", goInitialState);

// Função para virar para a próxima página
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
        updateButtons(); // Atualiza os botões após virar a página
    }
}

// Função para voltar para a página anterior
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
        
        updateButtons(); // Atualiza os botões após voltar a página
    }
}

// Função para voltar ao estado inicial (início do livro)
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
            updateButtons(); // Garante que os botões voltem ao estado inicial
        }
    }, 150);
}

// Animação de abrir o livro
function openBook() {
    book.style.transform = "translateX(50%)";
}

// Animação de fechar o livro
function closeBook(isAtBeginning) {
    if (isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
}