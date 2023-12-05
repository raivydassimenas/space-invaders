$(document).ready(function () {
  let gamePaused = true;
  const figureHeight = 25;
  const figureWidth = 25;
  const playerSpeed = 5;
  let invaderSpeed = 0.5;
  let level = 1;
  let lives = 3;
  let points = 0;
  const bulletSpeed = 10;
  const invaderBulletSpeed = 5;
  const bulletHeight = 10;
  const bulletWidth = 2;
  let bulletOn = false;
  let bullet;
  let invaderBullets = [];
  const canvas = document.querySelector("#game-canvas");
  canvas.width = 200;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  let highPoints = [0, 0, 0, 0, 0];

  $("#level").text(`Level: ${level}`);
  $("#lives").text(`Lives: ${lives}`);
  $("#points").text(`Points: ${points}`);

  function createPlayer() {
    const image = new Image();

    image.src = "./assets/Space invaders icon.png";
    image.height = figureHeight;
    image.width = figureWidth;

    player = {
      image,
      x: 0,
      y: canvas.height - figureHeight,
    };

    player.image.onload = drawPlayer;
  }

  function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, figureWidth, figureHeight);
  }

  let player;

  createPlayer();

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

  createInvaders();

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
          $("#lives").text(`Lives: ${lives}`);
          restartGame();
        }
      } else {
        invader.x += invaderSpeed;
      }
      if (Math.random() < 0.0005) {
        invaderBullets.push({
          x: invader.x + figureWidth / 2 - bulletWidth / 2,
          y: invader.y + figureHeight + bulletHeight,
        });
      }
    });
  }

  function moveInvaderBullets() {
    invaderBullets.forEach((bullet) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
      bullet.y += invaderBulletSpeed;
      if (bullet.y + bulletHeight > canvas.height) {
        invaderBullets.splice(invaderBullets.indexOf(bullet), 1);
      } else {
        if (
          bullet.x < player.x + figureWidth &&
          bullet.x > player.x &&
          bullet.y < player.y + figureHeight &&
          bullet.y + bulletHeight > player.y
        ) {
          lives--;
          if (lives < 0) {
            gameOver();
          }
          $("#lives").text(`Lives: ${lives}`);
          restartGame();
        }
      }
    });
  }

  function restartGame() {
    invaders = [];
    createInvaders();
    player = {};
    createPlayer();

    gamePaused = true;
  }

  function gameOver() {
    highPoints.push(points);
    highPoints.sort((a, b) => a - b);

    $("#game-container").hide();
    $("#high-score-table").html(
      `<div><p>High points</p><p>1: ${highPoints[0]}</p><p>2: ${highPoints[1]}</p><p>3: ${highPoints[2]}</p><p>4: ${highPoints[3]}</p><p>5: ${highPoints[4]}</p></div>`
    );
    $("#high-score-table").show();
    gamePaused = true;
  }

  $(document).keydown(function (event) {
    if (gamePaused) {
      if (event.which === 32) {
        gamePaused = false;
        $("#high-score-table-container").hide();
        $("#game-container").show();
        update();
      }
    } else if (event.key === "ArrowLeft" && player.x > 0) {
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
    if (!gamePaused) {
      ctx.fillStyle = "#000";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (bulletOn) {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
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
              $("#points").text(`Points: ${points}`);
              bulletOn = false;
              if (invaders.length === 0) {
                createInvaders();
                invaderSpeed += 0.5;
                level++;
                $("#level").text(`Level: ${level}`);
              }
            }
          });
        }
      }
      moveInvaders();
      moveInvaderBullets();
      drawInvaders();
      drawPlayer();
      requestAnimationFrame(update);
    }
  }

  $("#game-container").hide();
  $("#high-score-table").html(
    `<div><p>High points</p><p>1: ${highPoints[0]}</p><p>2: ${highPoints[1]}</p><p>3: ${highPoints[2]}</p><p>4: ${highPoints[3]}</p><p>5: ${highPoints[4]}</p></div>`
  );
  $("#high-score-table").show();
});
