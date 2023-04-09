const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
canvas.style.marginLeft = "auto";
canvas.style.marginRight = "auto";
canvas.style.marginTop = (screenHeight - canvasHeight) / 2 + "px";

canvas.focus(); // Focus the canvas to enable keyboard input



const tileSize = 32;
const playerColor = "purple";
let enemyColor = "green";

const player = {
  x: 5,
  y: 5,
  color: playerColor,
};

const lasers = [];

let enemies = [];

function spawnEnemies(count) {
for (let i = 0; i < count; i++) {
const enemy = {
x: Math.floor(Math.random() * 10),
y: Math.floor(Math.random() * 10),
color: enemyColor,
opacity: 1,
opacityDirection: -1,
fadeInterval: null,
};

// Set a timer to update the enemy's position and opacity every 1-4 seconds
enemy.fadeInterval = setInterval(() => {
const oldX = enemy.x;
const oldY = enemy.y;

const direction = Math.floor(Math.random() * 4);
switch (direction) {
  case 0:
    if (enemy.y > 0) {
      enemy.y--;
    }
    break;
  case 1:
    if (enemy.y < 9) {
      enemy.y++;
    }
    break;
  case 2:
    if (enemy.x > 0) {
      enemy.x--;
    }
    break;
  case 3:
    if (enemy.x < 9) {
      enemy.x++;
    }
    break;
}

// Toggle the opacity between 0 and 1 every 1-4 seconds
enemy.opacity = enemy.opacity === 1 ? 0 : 1;

// Update the enemy's opacity and position
if (oldX !== enemy.x || oldY !== enemy.y) {
  drawTile(enemy.x, enemy.y, enemy.color, tileSize, enemy.opacity);
}
}, Math.floor(Math.random() * 3000) + 1000);

enemies.push(enemy);
}
}
spawnEnemies(5);
function isoTo2D(x, y) {
  const offsetX = canvas.width / 2;
const offsetY = (canvas.height / 2) - (tileSize * 2);
  return {
    x: x - y + offsetX,
    y: (x + y) / 2 + offsetY,
  };
}



function drawTile(x, y, color, size = tileSize, opacity = 1) {
  const pos = isoTo2D(x * size, y * size);

  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  ctx.lineTo(pos.x + size / 2, pos.y + size / 4);
  ctx.lineTo(pos.x, pos.y + size / 2);
  ctx.lineTo(pos.x - size / 2, pos.y + size / 4);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.globalAlpha = opacity; // Set the globalAlpha to the provided opacity
  ctx.fill();
  ctx.globalAlpha = 1; // Reset the globalAlpha back to 1
}

// Collision detection
function isColliding(x, y) {
  if (x < 0 || x > 10 || y < 0 || y > 10) {
    return true;
  }

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.x === x && enemy.y === y) {
      return true;
    }
  }

  return false;
}
let movementInterval = null;

function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;

  if (!isColliding(newX, newY)) {
    player.x = newX;
    player.y = newY;
  }

  lastFacingDirection = dy === -1 ? 'up' : dy === 1 ? 'down' : dx === -1 ? 'left' : 'right';
}

let lastFacingDirection = "right";

function handleKeydown(event) {
  switch (event.key) {
    case "ArrowUp":
      event.preventDefault();
      player.y--;
      lastFacingDirection = "up";
      break;
    case "ArrowDown":
      event.preventDefault();
      player.y++;
      lastFacingDirection = "down";
      break;
    case "ArrowLeft":
      event.preventDefault();
      player.x--;
      lastFacingDirection = "left";
      break;
    case "ArrowRight":
      event.preventDefault();
      player.x++;
      lastFacingDirection = "right";
      break;
  }

  if (isColliding(player.x, player.y)) {
    switch (lastFacingDirection) {
      case "up":
        player.y++;
        break;
      case "down":
        player.y--;
        break;
      case "left":
        player.x++;
        break;
      case "right":
        player.x--;
        break;
    }
  }

  // Rotate the player sprite
  switch (lastFacingDirection) {
    case "up":
      player.color = "red";
      break;
    case "down":
      player.color = "blue";
      break;
    case "left":
      player.color = "yellow";
      break;
    case "right":
      player.color = "purple";
      break;
  }
}
let touchStartX = null;
let touchStartY = null;

function handleTouchStart(event) {
  event.preventDefault();
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    event.preventDefault();
    const touchMoveX = event.touches[0].clientX;
    const touchMoveY = event.touches[0].clientY;
  
    const touchDiffX = touchMoveX - touchStartX;
    const touchDiffY = touchMoveY - touchStartY;
  
    const moveThreshold = 10; // Threshold to determine when to move the player
  
    let dx = 0;
    let dy = 0;
  
    if (Math.abs(touchDiffX) > Math.abs(touchDiffY)) {
      if (touchDiffX > moveThreshold) {
        dx = 1;
        lastFacingDirection = "right";
      } else if (touchDiffX < -moveThreshold) {
        dx = -1;
        lastFacingDirection = "left";
      }
    } else {
      if (touchDiffY > moveThreshold) {
        dy = 1;
        lastFacingDirection = "down";
      } else if (touchDiffY < -moveThreshold) {
        dy = -1;
        lastFacingDirection = "up";
      }
    }
  
    if (dx !== 0 || dy !== 0) {
      // Only update the touch start position if we're actually moving the player
      touchStartX = touchMoveX;
      touchStartY = touchMoveY;
  
      const newX = player.x + dx;
      const newY = player.y + dy;
  
      if (!isColliding(newX, newY)) {
        player.x = newX;
        player.y = newY;
      }
    }
  
    // Direction detection
    switch (lastFacingDirection) {
      case "up":
        player.color = "red";
        break;
      case "down":
        player.color = "blue";
        break;
      case "left":
        player.color = "yellow";
        break;
      case "right":
        player.color = "purple";
        break;
    }
  }
  

// Draw text on the canvas if enemies are killed
let killedEnemies = 0;
function drawText(text, x, y, color = "black") {
  ctx.fillStyle = color;
  ctx.font = "30px Arial";
  ctx.fillText(text, x, y);
}

// Respawn enemies when they are killed
function respawnEnemies() {
  if (enemies.length === 0) {
    spawnEnemies(5);
  }
}

function shootLasers() {
// Store the direction in which the laser was fired
const firingDirection = lastFacingDirection;

const laser = {
x: player.x,
y: player.y,
color: player.color,
intervalId: null,
direction: firingDirection, // Add the direction property to the laser
};

function moveLaser() {
    const dx =
      laser.direction === "left"
        ? -1
        : laser.direction === "right"
        ? 1
        : 0;
    const dy =
      laser.direction === "up" ? -1 : laser.direction === "down" ? 1 : 0;
    laser.x += dx;
    laser.y += dy;
  
    drawTile(laser.x, laser.y, laser.color);
  
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (laser.x === enemy.x && laser.y === enemy.y && enemy.opacity >= 0.7) {
  
        // Play a sound effect when an enemy is hit by a laser
        const hitSound = new Audio('assets/hit.mp3');
        hitSound.play();
  
        clearInterval(laser.intervalId);
        lasers.splice(lasers.indexOf(laser), 1);
        enemies.splice(i, 1);
        killedEnemies++;
        drawText(`Killed enemies: ${killedEnemies}`, 10, 20);
        respawnEnemies();
        return;
      }
    }
  
    if (laser.y < 0 || laser.y > 10 || laser.x < 0 || laser.x > 10) {
      clearInterval(laser.intervalId);
      lasers.splice(lasers.indexOf(laser), 1);
    }
  }
  

laser.intervalId = setInterval(moveLaser, 100);
lasers.push(laser);
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw grid lines for the map area
ctx.strokeStyle = "black";
ctx.lineWidth = 1;

for (let i = 0; i <= 10; i++) {
for (let j = 0; j <= 10; j++) {
const topLeft = isoTo2D(i * tileSize, j * tileSize);
const topRight = isoTo2D((i + 1) * tileSize, j * tileSize);
const bottomLeft = isoTo2D(i * tileSize, (j + 1) * tileSize);
const bottomRight = isoTo2D((i + 1) * tileSize, (j + 1) * tileSize);

ctx.beginPath();
ctx.moveTo(topLeft.x, topLeft.y);
ctx.lineTo(topRight.x, topRight.y);
ctx.lineTo(bottomRight.x, bottomRight.y);
ctx.lineTo(bottomLeft.x, bottomLeft.y);
ctx.closePath();
ctx.stroke();
}
}
for (let i = 0; i < 10; i++) {
for (let j = 0; j < 10; j++) {
//drawTile(i, j, "grey");
}
}

for (let i = 0; i < enemies.length; i++) {
const enemy = enemies[i];
drawTile(enemy.x, enemy.y, enemy.color, tileSize, enemy.opacity);
}

for (let i = 0; i < lasers.length; i++) {
const laser = lasers[i];
drawTile(laser.x, laser.y, laser.color);
}

// Rotate the player sprite based on the direction the player is facing
drawTile(player.x, player.y, player.color, player.rotation);
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
  drawText(`Killed enemies: ${killedEnemies}`, 10, 60);
  // Direction detection
  drawText(`Last facing direction: ${lastFacingDirection}`, 10, 100);
}

canvas.addEventListener("keydown", handleKeydown);
canvas.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    shootLasers();
  }
});
const fireButton = document.getElementById("fireButton");
fireButton.addEventListener("touchstart", (event) => {
  event.preventDefault(); // Prevent the button from stealing focus
  shootLasers();
});
rightButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  if (movementInterval){

  clearInterval(movementInterval)
  movementInterval = setInterval(() => movePlayer(1, 0), 100)}
  else{
    // move the player once
    movePlayer(1, 0)
  }
});

rightButton.addEventListener('touchend', (event) => {
  event.preventDefault();
  clearInterval(movementInterval);
});

leftButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  if (movementInterval){
     clearInterval(movementInterval);
  movementInterval = setInterval(() => movePlayer(-1, 0), 100)}
  else{
    // move the player once
    movePlayer(-1, 0)
  }
});

leftButton.addEventListener('touchend', (event) => {
  event.preventDefault();
  clearInterval(movementInterval);
});

upButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  if (movementInterval){ clearInterval(movementInterval);
  movementInterval = setInterval(() => movePlayer(0, -1), 100)}
  else{
    // move the player once
    movePlayer(0, -1)
  }
});

upButton.addEventListener('touchend', (event) => {
  event.preventDefault();
  clearInterval(movementInterval);
});

downButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  if (movementInterval) {clearInterval(movementInterval)
  movementInterval = setInterval(() => movePlayer(0, 1), 100)
  }
  else{
    // move the player once
    movePlayer(0, 1)
  }
});

downButton.addEventListener('touchend', (event) => {
  event.preventDefault();
  clearInterval(movementInterval);
});

window.onload = function () {
  canvas.focus();
};

gameLoop();
