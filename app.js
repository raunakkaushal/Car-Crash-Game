const startBtn = document.getElementById("start-btn");
const gif = document.getElementById("gif");
const image = document.getElementById("image");
const animationContainer = document.querySelector(".animation-container");
const container = document.querySelector(".container");
const scoreElement = document.querySelector("#score");
const gameOverScreen = document.getElementById("game-over-screen");
const finalScoreElement = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");

let currentCarIndex = 1;
let isGameRunning = false;
let isGamePaused = false;
let score = 0;
let scoreInterval = null;
let obstacleInterval = null;
let obstacles = [];

function updateCarVisibility() {
    const cars = document.querySelectorAll(".car");
    cars.forEach((car, index) => {
        car.style.display = index === currentCarIndex ? "block" : "none";
    });
}

function updateScore() {
    scoreElement.textContent = score;
}

function getObstacleSpeed() {
    if (score > 60) {
        return 18;
    } else if (score > 50) {
        return 15;
    } else if (score > 40) {
        return 12;
    } else if (score > 30) {
        return 10;
    } else if (score > 15) {
        return 8;
    } else {
        return 6;
    }

}

function startGame() {
    isGameRunning = true;
    isGamePaused = false;
    score = 0;
    updateScore();

    container.style.display = 'grid';
    document.querySelector(".score").style.display = 'block';
    startBtn.style.display = 'none';
    document.querySelector(".button-section").style.display = 'flex';

    scoreInterval = setInterval(() => {
        score++;
        updateScore();
    }, 1000);

    obstacleInterval = setInterval(createObstacle, 1200);
}


function stopGame() {
    isGameRunning = false;
    startBtn.style.display = 'block';
    clearInterval(scoreInterval);
    clearInterval(obstacleInterval);
    scoreInterval = null;
    obstacleInterval = null;
    obstacles = [];

    document.querySelectorAll(".obstacle").forEach(obstacle => obstacle.remove());
}

function gameOver() {
    stopGame();
    gameOverScreen.style.display = 'block';
    finalScoreElement.textContent = score;
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    startGame();
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');

    const randomTrackIndex = Math.floor(Math.random() * 3);
    const track = container.children[randomTrackIndex];
    track.appendChild(obstacle);

    let obstaclePosition = -100;
    const obstacleSpeed = getObstacleSpeed();

    const moveObstacle = setInterval(() => {
        obstaclePosition += obstacleSpeed;
        obstacle.style.top = obstaclePosition + 'px';

        const carElement = document.querySelector(`.car-${randomTrackIndex + 1}`);
        const carRect = carElement.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            carRect.left < obstacleRect.right &&
            carRect.right > obstacleRect.left &&
            carRect.top < obstacleRect.bottom &&
            carRect.bottom > obstacleRect.top
        ) {
            clearInterval(moveObstacle);
            obstacle.remove();
            gameOver();
        }

        if (obstaclePosition > track.clientHeight) {
            obstacle.remove();
            clearInterval(moveObstacle);
        }
    }, 20);
}


startBtn.addEventListener("click", () => {
    leftBtn.style.display = 'block';
    rightBtn.style.display = 'block';
    animationContainer.style.display = 'none';
    startGame();
});

restartBtn.addEventListener("click", restartGame);

leftBtn.addEventListener("click", () => {
    if (isGameRunning) {
        currentCarIndex = Math.max(currentCarIndex - 1, 0);
        updateCarVisibility();
    }
});

rightBtn.addEventListener("click", () => {
    if (isGameRunning) {
        currentCarIndex = Math.min(currentCarIndex + 1, 2);
        updateCarVisibility();
    }
});

setTimeout(() => {
    leftBtn.style.display = 'none';
    rightBtn.style.display = 'none';
    gif.style.display = 'block';
    setTimeout(() => {
        gif.style.display = 'none';
        image.style.display = 'block';
        startBtn.style.display = 'block';
    }, 3000);
}, 0);
document.addEventListener('keydown', (event) => {
    if (isGameRunning) {
        switch (event.key) {
            case 'ArrowLeft':
                if (currentCarIndex > 0) {
                    currentCarIndex--;
                    updateCarVisibility();
                }
                break;
            case 'ArrowRight':
                if (currentCarIndex < 2) {
                    currentCarIndex++;
                    updateCarVisibility();
                }
                break;
        }
    }
});
