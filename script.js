const figureHeight = 25;
const figureWidth = 25;
const playerSpeed = 5;
const invaderSpeed = 1;
const canvas = document.querySelector("#game-canvas");
canvas.width = 200;
canvas.height = 400;

$(document).ready(function() {
    
    const ctx = canvas.getContext('2d');
    playGame(ctx);

});

function playGame(ctx) {
    const image = new Image();

    image.src = "./assets/Space\ invaders\ icon.png";
    image.height = figureHeight;
    image.width = figureWidth;

    const player = {
        image,
        x: 0,
        y: canvas.height - figureHeight
    }

    function drawPlayer() {
        ctx.drawImage(player.image, player.x, player.y, figureWidth, figureHeight);
    }

    $(document).keydown(function(event) {
        if (event.key === "ArrowLeft" && player.x > 0) {
            player.x -= playerSpeed;
        }
        else if (event.key === "ArrowRight" && player.x < canvas.width - figureWidth) {
            player.x += playerSpeed;
        }
    });

    player.image.onload = drawPlayer;

    const invaders = [];
    for (let i = 0; i < 40; i++) {
        const image = new Image();
        image.src = "./assets/Alien\ icon.png";
        image.height = figureHeight;
        image.width = figureWidth;
        const invader = {
            image,
            x: figureWidth * (i % 8),
            y: figureHeight * (Math.floor(i / 8))
        }
        invaders.push(invader);
    }

    let loadedImages = 0;
    invaders.forEach(function(invader) {
        invader.image.onload = function() {
            loadedImages++;
            if (loadedImages === invaders.length) {
                drawInvaders();
            }
        }
    });

    function drawInvaders() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        invaders.forEach(function(invader) {
            ctx.drawImage(invader.image, invader.x, invader.y, figureWidth, figureHeight);
        });
    }

    function moveInvaders() {
        invaders.forEach(invader => {
            if (invader.x + invaderSpeed + 1 > canvas.width) {
                invader.x = 0;
                invader.y += figureHeight;
            } else {
                invader.x += invaderSpeed;
            }
        })
    }

    function update() {
        moveInvaders();
        drawInvaders();
        drawPlayer();
        requestAnimationFrame(update);
    }

    (function() {
        update();
    })();
}