const figureHeight = 25;
const figureWidth = 25;
const playerSpeed = 5;
let invaderSpeed = 0.5;
let level = 1;
let points = 0;
let lives = 3;
const bulletSpeed = 10;
const bulletHeight = 10;
const bulletWidth = 2;
let bulletOn = false;
let bullet;
const canvas = document.querySelector("#game-canvas");
canvas.width = 200;
canvas.height = 400;
const ctx = canvas.getContext("2d");

function resetGame() {
  invaderSpeed = 0.5;
  level = 1;
}

$(document).ready(function () {
  playGame();
});

function playGame() {
  const image = new Image();

  image.src = "./assets/Space invaders icon.png";
  image.height = figureHeight;
  image.width = figureWidth;

  let player = {
    image,
    x: 0,
    y: canvas.height - figureHeight,
  };

  function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, figureWidth, figureHeight);
  }

  player.image.onload = drawPlayer;

  let invaders = [];

  function createInvaders() {
    for (let i = 0; i < 40; i++) {
      const image = new Image();
      image.src = "./assets/Alien icon.png";
      image.height = figureHeight;
      image.width = figureWidth;
      const invader = {
        image,
        x: figureWidth * (i % 8),
        y: figureHeight * Math.floor(i / 8),
      };
      invaders.push(invader);
    }

    let loadedImages = 0;
    invaders.forEach(function (invader) {
      invader.image.onload = function () {
        loadedImages++;
        if (loadedImages === invaders.length) {
          drawInvaders();
        }
      };
    });
  }

  createInvaders();

  function drawInvaders() {
    invaders.forEach(function (invader) {
      ctx.drawImage(
        invader.image,
        invader.x,
        invader.y,
        figureWidth,
        figureHeight
      );
    });
  }

  function moveInvaders() {
    invaders.forEach((invader) => {
      if (invader.x + invaderSpeed + 1 > canvas.width) {
        invader.x = 0;
        invader.y += figureHeight;
        if (invader.y > canvas.height - 2 * figureHeight) {
          lives--;
          if (lives < 0) {
            gameOver();
          }
          invaders = [];
          createInvaders();
          player = {
            image,
            x: 0,
            y: canvas.height - figureHeight,
          };
          player.image.onload = drawPlayer;
          resetGame();
        }
      } else {
        invader.x += invaderSpeed;
      }
    });
  }

  $(document).keydown(function (event) {
    if (event.key === "ArrowLeft" && player.x > 0) {
      player.x -= playerSpeed;
    } else if (
      event.key === "ArrowRight" &&
      player.x < canvas.width - figureWidth
    ) {
      player.x += playerSpeed;
    } else if (event.which === 32) {
      if (!bulletOn) {
        bulletOn = true;
        bullet = {
          x: player.x + figureWidth / 2 - bulletWidth / 2,
          y: player.y - bulletHeight,
        };
      }
    }
  });

  function update() {
    ctx.fillStyle = "#000";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bulletOn) {
      ctx.fillRect(bullet.x, bullet.y, 1, bulletHeight);
      bullet.y -= bulletSpeed;
      if (bullet.y < 0) {
        bulletOn = false;
      } else {
        invaders.forEach((invader) => {
          if (
            bullet.x < invader.x + figureWidth &&
            bullet.x > invader.x &&
            bullet.y < invader.y + figureHeight &&
            bullet.y + bulletHeight > invader.y
          ) {
            invaders.splice(invaders.indexOf(invader), 1);
            points += 10;
            bulletOn = false;
            if (invaders.length === 0) {
              createInvaders();
              invaderSpeed += 0.5;
              level++;
            }
          }
        });
      }
    }
    moveInvaders();
    drawInvaders();
    drawPlayer();
    requestAnimationFrame(update);
  }

  update();
}
