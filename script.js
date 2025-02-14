const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mapSize = 5000;

// Function to get colors dynamically
function getColors() {
    const rootStyles = getComputedStyle(document.documentElement);
    return {
        playerColor: rootStyles.getPropertyValue("--player-color").trim() || "rgb(255, 255, 255)",
        enemyColor: rootStyles.getPropertyValue("--enemy-color").trim() || "rgb(0, 255, 0)",
        foodColor: rootStyles.getPropertyValue("--food-color").trim() || "rgb(255, 255, 255)",
        backgroundColor: rootStyles.getPropertyValue("--background-color").trim() || "rgb(0, 0, 0)"
    };
}

// Player object
const player = {
    x: mapSize / 2,
    y: mapSize / 2,
    radius: 30,
    baseSpeed: 5,
    get speed() {
        return this.baseSpeed / (this.radius / 10);
    }
};

// Enemies
const enemies = [];
const enemyCount = 500;

for (let i = 0; i < enemyCount; i++) {
    enemies.push({
        x: Math.random() * mapSize,
        y: Math.random() * mapSize,
        radius: 15 + Math.random() * 15,
        baseSpeed: 2 + Math.random(),
        get speed() {
            return this.baseSpeed / (this.radius / 10);
        },
        target: null
    });
}

// Food particles
const foods = [];
for (let i = 0; i < 200; i++) {
    foods.push({
        x: Math.random() * mapSize,
        y: Math.random() * mapSize,
        radius: 5
    });
}

// Handle player movement
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

canvas.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Move NPCs
function moveEnemies() {
    const colors = getColors(); // Refresh colors
    for (let enemy of enemies) {
        enemy.color = colors.enemyColor; // Update enemy color dynamically
        enemy.target = findTarget(enemy);

        if (enemy.target) {
            const dx = enemy.target.x - enemy.x;
            const dy = enemy.target.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > enemy.speed) {
                enemy.x += (dx / distance) * enemy.speed;
                enemy.y += (dy / distance) * enemy.speed;
            }
        }
    }
}

// Find closest target (player or smaller NPCs)
function findTarget(enemy) {
    let closestTarget = null;
    let closestDist = Infinity;

    // Check player
    const playerDist = Math.sqrt((player.x - enemy.x) ** 2 + (player.y - enemy.y) ** 2);
    if (enemy.radius > player.radius && playerDist < closestDist) {
        closestTarget = player;
        closestDist = playerDist;
    }

    // Check other enemies
    for (let other of enemies) {
        if (other !== enemy && other.radius < enemy.radius) {
            const dist = Math.sqrt((other.x - enemy.x) ** 2 + (other.y - enemy.y) ** 2);
            if (dist < closestDist) {
                closestTarget = other;
                closestDist = dist;
            }
        }
    }

    return closestTarget;
}

// Check for collisions
function checkCollisions() {
    for (let i = foods.length - 1; i >= 0; i--) {
        const food = foods[i];
        const dist = Math.sqrt((food.x - player.x) ** 2 + (food.y - player.y) ** 2);
        if (dist < player.radius) {
            foods.splice(i, 1);
            player.radius += 1;
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const dist = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);

        if (dist < player.radius - 5) {
            enemies.splice(i, 1);
            player.radius += 5;
        } else if (dist < enemy.radius - 5) {
            alert("Game Over! You got eaten.");
            location.reload();
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (i !== j && enemies[i] && enemies[j]) {
                const dist = Math.sqrt((enemies[i].x - enemies[j].x) ** 2 + (enemies[i].y - enemies[j].y) ** 2);
                if (dist < enemies[i].radius - 5) {
                    enemies[i].radius += enemies[j].radius / 2;
                    enemies.splice(j, 1);
                }
            }
        }
    }
}

// Update function
function update() {
    const colors = getColors(); // Refresh colors each update
    player.color = colors.playerColor; // Update player color dynamically

    for (let enemy of enemies) {
        enemy.color = colors.enemyColor; // Update enemy color dynamically
    }

    for (let food of foods) {
        food.color = colors.foodColor; // Update food color dynamically
    }

    const dx = mouseX - canvas.width / 2;
    const dy = mouseY - canvas.height / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > player.speed) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    }

    moveEnemies();
    checkCollisions();
}

// Draw everything
function draw() {
    const colors = getColors(); // Refresh colors before drawing

    document.body.style.backgroundColor = colors.backgroundColor;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const offsetX = canvas.width / 2 - player.x;
    const offsetY = canvas.height / 2 - player.y;

    ctx.save();
    ctx.translate(offsetX, offsetY);

    // Draw food
    for (const food of foods) {
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
        ctx.fillStyle = food.color;  // Now uses dynamically updated color
        ctx.fill();
        ctx.closePath();
    }

    // Draw enemies
    for (const enemy of enemies) {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color; 
        ctx.fill();
        ctx.closePath();
    }

    // Draw player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();

    ctx.restore();
}
// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
