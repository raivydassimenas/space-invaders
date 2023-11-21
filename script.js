$(document).ready(function() {
    const canvas = document.querySelector("#game-canvas");
    canvas.width = 200;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    initializeCanvas(ctx);

});

function initializeCanvas(ctx) {
    const player = new Image();

    player.src = "./assets/Space\ invaders\ icon.png";
    player.height = 10;
    player.width = 10;
    // player.classList.add('.player');
    // player.onload = function() {
    //     ctx.drawImage(player, 0, 0, player.width, player.height);
    // }

    const invaders = [];
    for (let i = 0; i < 40; i++) {
        invaders.push(new Image());
        invaders[invaders.length - 1].src = "./assets/Alien\ icon.png";
        invaders[invaders.length - 1].height = 20;
        invaders[invaders.length - 1].width = 20;
    }

    let loadedImages = 0;
    invaders.forEach(function(image) {
        image.onload = function() {
            loadedImages++;
            if (loadedImages === invaders.length) {
                drawInvaders(invaders, ctx);
            }
        }
    })

    function drawInvaders(invaders, ctx) {
        invaders.forEach(function(image, index) {
            const x = 20 * (index % 8);
            const y = 20 * (Math.floor(index / 8));
            ctx.drawImage(image, x, y, 20, 20);
        })
    }
}