const figureHeight = 25;
const figureWidth = 25;
const invaderSpeed = 5;
const canvas = document.querySelector("#game-canvas");
canvas.width = 200;
canvas.height = 400;

$(document).ready(function() {
    
    const ctx = canvas.getContext('2d');
    initializeCanvas(ctx);

});

function initializeCanvas(ctx) {
    const image = new Image();

    image.src = "./assets/Space\ invaders\ icon.png";
    image.height = figureHeight;
    image.width = figureWidth;

    const player = {
        image,
        x: 0,
        y: 375
    }

    player.image.onload = function() {
        ctx.drawImage(player.image, player.x, player.y, figureWidth, figureHeight);
    }

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
                drawInvaders(invaders, ctx);
            }
        }
    })

    function drawInvaders() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        invaders.forEach(function(invader) {
            ctx.drawImage(invader.image, invader.x, invader.y, figureWidth, figureHeight);
        })
    }

    function moveInvaders() {
        invaders.forEach(invader => {
            if (invader.x + 10 > canvas.length) {
                invader.x = 0;
                invader.y += 25;
            } else {
                invader.x += 5;
            }
        })
    }

    function update() {
        moveInvaders();
        drawInvaders()
    }

    (function playGame() {
        setInterval(update, 1000 / 30);
    })();
}