# How to Make an Antivirus vs. Viruses Game (Agar.io Style)

## Introduction
In this tutorial, we’ll create a simple game where an antivirus moves around, consumes viruses, and grows in size. The game will have an **Agar.io-style** movement system and mechanics. We’ll be using **HTML, CSS, and JavaScript** to build everything from scratch.

## Step 1: Setting Up the Project

Before writing any code, let’s create the necessary files:
1. **index.html** – The main HTML file.
2. **styles.css** – The CSS file for styling.
3. **script.js** – The JavaScript file for game logic.

### **1. Create the HTML File**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Antivirus vs. Viruses</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script src="script.js"></script>
</body>
</html>
```

### **2. Add Basic Styling with CSS**

Create a new file **styles.css** and add the following:

```css
/* Define colors for the game */
:root {
    --player-color: rgb(213, 213, 231);
    --virus-color: rgb(13, 173, 13);
    --background-color: white;
}

/* Remove default margin and prevent scrolling */
body {
    margin: 0;
    overflow: hidden;
    background-color: var(--background-color);
}

/* Make the canvas cover the whole screen */
canvas {
    display: block;
}
```

## Step 2: Creating the Game Canvas
Now, let’s set up the **gameCanvas** in **script.js**.

```js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
```

This will ensure the game covers the entire screen.

## Step 3: Adding the Player (Antivirus)

We’ll create an **antivirus** object and make it move using the keyboard.

```js
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 30,
    speed: 5,
};

let keys = {};

window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function movePlayer() {
    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;
}
```

## Step 4: Spawning Viruses

We need to create viruses that the antivirus can eat.

```js
const viruses = [];
const virusCount = 50;

for (let i = 0; i < virusCount; i++) {
    viruses.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 15 + Math.random() * 10,
    });
}
```

## Step 5: Drawing the Game Objects

Now, let’s draw the **player and viruses** on the canvas.

```js
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw viruses
    ctx.fillStyle = "green";
    for (let virus of viruses) {
        ctx.beginPath();
        ctx.arc(virus.x, virus.y, virus.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw player
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
}
```

## Step 6: Handling Collisions (Eating Viruses)

We’ll check if the antivirus collides with a virus, and if so, remove it and grow the antivirus.

```js
function checkCollisions() {
    for (let i = viruses.length - 1; i >= 0; i--) {
        let virus = viruses[i];
        let dx = virus.x - player.x;
        let dy = virus.y - player.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius) {
            viruses.splice(i, 1);
            player.radius += 3;
        }
    }
}
```

## Step 7: Updating the Game Loop

Finally, let’s put everything together in a game loop.

```js
function update() {
    movePlayer();
    checkCollisions();
    draw();
    requestAnimationFrame(update);
}

update();
```

## Step 8: Game Over Condition

If a virus is larger than the antivirus, the game should end.

```js
function checkGameOver() {
    for (let virus of viruses) {
        let dx = virus.x - player.x;
        let dy = virus.y - player.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < virus.radius && virus.radius > player.radius) {
            alert("Game Over! The antivirus got consumed.");
            location.reload();
        }
    }
}
```

Call this function in `update()` to check every frame:

```js
function update() {
    movePlayer();
    checkCollisions();
    checkGameOver();
    draw();
    requestAnimationFrame(update);
}
```

## Conclusion
That’s it! 🎉 You now have a **fully working antivirus vs. viruses game**. The antivirus moves around, eats smaller viruses, and grows in size, while larger viruses remain a threat.

### **Possible Improvements**
- Add animations and effects.
- Improve AI for viruses (e.g., making them move towards or away from the player).
- Implement scoring and UI elements.

Hope you enjoyed this tutorial! 🚀

