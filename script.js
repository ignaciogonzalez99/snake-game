// Variables y elementos del DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');
const muteButton = document.getElementById('muteButton');

// Configuración del juego
const canvasSize = 400;
const gridSize = 20;
const tileCount = canvasSize / gridSize;

let snake = [];
let direction = { x: 1, y: 0 }; // Dirección inicial: derecha
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let gameInterval;
let speed = 100; // milisegundos

// Variable para el reproductor de YouTube
let player;

// Función llamada por la API de YouTube cuando está lista
function onYouTubeIframeAPIReady() {
    player = new YT.Player('bgVideo', {
        events: {
            'onReady': onPlayerReady
        },
        playerVars: {
            'autoplay': 1,
            'mute': 1, // Inicialmente silenciado
            'loop': 1,
            'playlist': 'rn_bzGx7ToI', // Reemplaza con tu ID de video
            'controls': 0,
            'showinfo': 0,
            'autohide': 1,
            'modestbranding': 1,
            'disablekb': 1,
            'iv_load_policy': 3,
            'rel': 0
        }
    });
}

// Función llamada cuando el reproductor está listo
function onPlayerReady(event) {
    console.log('YouTube Player Ready');
    event.target.playVideo();
}

// Inicializar el juego
function init() {
    snake = [
        { x: 9, y: 9 },
        { x: 8, y: 9 },
        { x: 7, y: 9 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    placeFood();
    score = 0;
    scoreElement.textContent = score;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);

    // Mostrar el juego con transición
    document.querySelector('.game-container').classList.add('active');
}

// Colocar comida en una posición aleatoria no ocupada por la serpiente
function placeFood() {
    let valid = false;
    while (!valid) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        valid = true;
        for (let part of snake) {
            if (part.x === food.x && part.y === food.y) {
                valid = false;
                break;
            }
        }
    }
}

// Bucle del juego
function gameLoop() {
    update();
    draw();
}

// Actualizar la posición de la serpiente y verificar colisiones
function update() {
    direction = nextDirection; // Actualizar dirección a la siguiente dirección

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Verificar colisión con las paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        clearInterval(gameInterval);
        alert('¡Game Over! Tu puntuación: ' + score);
        return;
    }

    // Verificar colisión con sí mismo
    for (let part of snake) {
        if (part.x === head.x && part.y === head.y) {
            clearInterval(gameInterval);
            alert('¡Game Over! Tu puntuación: ' + score);
            return;
        }
    }

    snake.unshift(head);

    // Verificar si la serpiente ha comido la comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }
}

// Dibujar todo en el canvas
function draw() {
    // Limpiar canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Dibujar serpiente
    ctx.fillStyle = '#0f0';
    for (let part of snake) {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Dibujar comida
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Manejar la entrada del teclado
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x === 0) {
                nextDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x === 0) {
                nextDirection = { x: 1, y: 0 };
            }
            break;
    }
});

// Función para silenciar/reproducir el video
function toggleMute() {
    if (player.isMuted()) {
        player.unMute();
        muteButton.textContent = 'Silenciar Video';
        console.log('Video desmuted');
    } else {
        player.mute();
        muteButton.textContent = 'Reproducir Sonido';
        console.log('Video muted');
    }
}

// Asignar el evento al botón de muteo
muteButton.addEventListener('click', toggleMute);

// Iniciar el juego cuando se haga clic en el botón de inicio
startButton.addEventListener('click', () => {
    init();

    // Reproducir el video con sonido al iniciar el juego
    if (player && player.getPlayerState() !== YT.PlayerState.PLAYING) {
        player.unMute();
        player.playVideo();
        console.log('Video unmuted and playing');
    }
});

// **Eliminamos la inicialización del juego al cargar la ventana**
 window.onload = init;
