// Dimensioni della board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Dimensioni e posizione iniziale di Flappy Bird
let birdWidth = 34;   
let birdHeight = 24;
let birdX = boardWidth / 8; // Corretto
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x : birdX, 
    y : birdY, 
    width: birdWidth,
    height: birdHeight
};

// Tubi
let tubiArray = [];
let tubiWidth = 64;
let tubiHeight = 512;
let tubiX = boardWidth;
let tubiY = 0;
let topTubiImg;
let bottomTubiImg;

window.onload = function () {
    // Configurazione della board
    board = document.getElementById("board");
    if (!board) {
        console.error("Canvas con id 'board' non trovato!");
        return;
    }

    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    if (!context) {
        console.error("Context 2D non trovato!");
        return;
    }

    // Caricamento dell'immagine di Flappy Bird
    birdImg = new Image();
    birdImg.src = "./immaginiflappybird/flappybird.png"; // Percorso corretto

    birdImg.onload = function () {
        context.clearRect(0, 0, boardWidth, boardHeight); // Pulisce la board
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); // Disegna l'immagine
    };

    birdImg.onerror = function () {
        console.error("Impossibile caricare l'immagine: " + birdImg.src);
    };

    // Caricamento delle immagini dei tubi
    topTubiImg = new Image();
    topTubiImg.src = "./immaginiflappybird/top.png";

    bottomTubiImg = new Image(); // Corretto
    bottomTubiImg.src = "./immaginiflappybird/bottom.png"; // Corretto

    // Inizia il gioco
    requestAnimationFrame(update);
    setInterval(mettitubi, 1500);
};

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height); // Corretto
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Disegna i tubi
    for (let i = 0; i < tubiArray.length; i++) {
        let tubo = tubiArray[i];
        context.drawImage(tubo.img, tubo.x, tubo.y, tubo.width, tubo.height);
        tubo.x -= 2; // Movimento verso sinistra
    }
}

function mettitubi() {
    // Tubi sopra
    let topTubi = {
        img: topTubiImg,
        x: tubiX,
        y: tubiY,
        width: tubiWidth,
        height: tubiHeight,
        passed: false    
    };
    tubiArray.push(topTubi);

    // Tubi sotto
    let bottomTubi = {
        img: bottomTubiImg,
        x: tubiX,
        y: tubiY + tubiHeight + 150, // Spazio tra i tubi
        width: tubiWidth,
        height: tubiHeight,
        passed: false
    };
    tubiArray.push(bottomTubi);
}