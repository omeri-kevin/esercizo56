//board
let board; // Riferimento alla tavola di gioco (canvas)
let boardWidth = 360; // Larghezza della tavola
let boardHeight = 640; // Altezza della tavola
let context; // Contesto per disegnare sulla tavola

//bird
let birdWidth = 34; // Larghezza dell'uccello (rapporto larghezza/altezza = 17/12)
let birdHeight = 24; // Altezza dell'uccello
let birdX = boardWidth / 8; // Posizione iniziale dell'uccello sull'asse X
let birdY = boardHeight / 2; // Posizione iniziale dell'uccello sull'asse Y
let birdImg; // Immagine dell'uccello

// Oggetto che rappresenta l'uccello
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = []; // Array per memorizzare i tubi
let pipeWidth = 64; // Larghezza dei tubi (rapporto larghezza/altezza = 1/8)
let pipeHeight = 512; // Altezza dei tubi
let pipeX = boardWidth; // Posizione iniziale dei tubi sull'asse X
let pipeY = 0; // Posizione iniziale dei tubi sull'asse Y

let topPipeImg; // Immagine del tubo superiore
let bottomPipeImg; // Immagine del tubo inferiore

//physics
let velocityX = -2; // Velocità con cui i tubi si muovono verso sinistra

let gameOver = false; // Stato del gioco (true se il gioco è finito)
let score = 0; // Punteggio del giocatore

// Funzione che viene eseguita al caricamento della finestra
window.onload = function() {
    board = document.getElementById("board"); // Ottiene il riferimento al canvas
    board.height = boardHeight; // Imposta l'altezza del canvas
    board.width = boardWidth; // Imposta la larghezza del canvas
    context = board.getContext("2d"); // Ottiene il contesto per disegnare

    // Carica l'immagine dell'uccello
    birdImg = new Image();
    birdImg.src = "./immaginiflappybird/flappybird.png"; // Percorso dell'immagine
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); // Disegna l'uccello
    }

    // Carica le immagini dei tubi
    topPipeImg = new Image();
    topPipeImg.src = "./immaginiflappybird/top.png"; // Percorso del tubo superiore

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./immaginiflappybird/bottom.png"; // Percorso del tubo inferiore

    requestAnimationFrame(update); // Avvia il ciclo di aggiornamento
    setInterval(placePipes, 1500); // Posiziona nuovi tubi ogni 1,5 secondi
    document.addEventListener("keydown", moveBird); // Aggiunge un listener per il movimento dell'uccello
}

// Funzione per aggiornare lo stato del gioco
function update() {
    requestAnimationFrame(update); // Richiama continuamente la funzione
    if (gameOver) {
        return; // Se il gioco è finito, interrompe l'aggiornamento
    }
    context.clearRect(0, 0, board.width, board.height); // Pulisce la tavola

    // Disegna l'uccello
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Gestisce i tubi
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX; // Sposta i tubi verso sinistra
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); // Disegna il tubo

        // Incrementa il punteggio se l'uccello supera un tubo
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // 0.5 per ogni tubo (2 tubi per set)
            pipe.passed = true;
        }

        // Controlla la collisione tra l'uccello e il tubo
        if (detectCollision(bird, pipe)) {
            gameOver = true; // Imposta lo stato di fine gioco
        }
    }

    // Rimuove i tubi che sono usciti dallo schermo
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // Rimuove il primo elemento dell'array
    }

    // Mostra il punteggio
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45); // Disegna il punteggio

    // Mostra "GAME OVER" se il gioco è finito
    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

// Funzione per posizionare nuovi tubi
function placePipes() {
    if (gameOver) {
        return; // Non posiziona nuovi tubi se il gioco è finito
    }

    // Calcola una posizione casuale per il tubo superiore
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4; // Spazio tra i tubi superiore e inferiore

    // Crea il tubo superiore
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe); // Aggiunge il tubo superiore all'array

    // Crea il tubo inferiore
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe); // Aggiunge il tubo inferiore all'array
}

// Funzione per muovere l'uccello
function moveBird(e) {
    if (e.code == "Space") { // Se viene premuta la barra spaziatrice
        bird.y -= 50; // L'uccello si sposta verso l'alto

        // Resetta il gioco se è finito
        if (gameOver) {
            bird.y = birdY; // Ripristina la posizione dell'uccello
            pipeArray = []; // Svuota l'array dei tubi
            score = 0; // Resetta il punteggio
            gameOver = false; // Ripristina lo stato del gioco
        }
    }
}

// Funzione per rilevare la collisione tra due oggetti
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // Controlla se i bordi si sovrappongono sull'asse X
           a.x + a.width > b.x &&   
           a.y < b.y + b.height && // Controlla se i bordi si sovrappongono sull'asse Y
           a.y + a.height > b.y;    
}