document.addEventListener('DOMContentLoaded', () => {
    const mazeElement = document.getElementById('maze');
    const messageElement = document.getElementById('message');
    const controls = document.querySelectorAll('.control-btn');

    // --- Game Configuration ---
    const COLS = 10;
    const ROWS = 10;
    const CELL_SIZE = 40; // Size of each cell in pixels
    let playerPos = { x: 0, y: 0 };
    const goalPos = { x: COLS - 1, y: ROWS - 1 };
    let isGameRunning = true;

    // The maze map (0 = Path, 1 = Wall/Blocked)
    const mazeMap = [
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Start: (0, 0)
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // Goal: (9, 9)
    ];

    // --- Maze Rendering ---
    const renderMaze = () => {
        mazeElement.style.width = `${COLS * CELL_SIZE}px`;
        mazeElement.style.height = `${ROWS * CELL_SIZE}px`;
        mazeElement.innerHTML = ''; 

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `cell-${x}-${y}`;
                cell.style.width = `${CELL_SIZE}px`;
                cell.style.height = `${CELL_SIZE}px`;

                // Set wall borders based on adjacent wall cells
                if (mazeMap[y][x] === 0) {
                    // Path cell: define path borders visually
                    if (y > 0 && mazeMap[y - 1][x] === 1) cell.classList.add('wall-top');
                    if (x < COLS - 1 && mazeMap[y][x + 1] === 1) cell.classList.add('wall-right');
                    if (y < ROWS - 1 && mazeMap[y + 1][x] === 1) cell.classList.add('wall-bottom');
                    if (x > 0 && mazeMap[y][x - 1] === 1) cell.classList.add('wall-left');
                } else {
                    // Wall cell 
                    cell.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    cell.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                }

                if (x === goalPos.x && y === goalPos.y) {
                    cell.classList.add('goal');
                }

                mazeElement.appendChild(cell);
            }
        }
    };

    // --- Player Rendering & Movement ---
    const createPlayer = () => {
        const player = document.createElement('div');
        player.classList.add('player');
        player.id = 'player';
        document.getElementById(`cell-0-0`).appendChild(player); 
    };

    const movePlayer = (dx, dy) => {
        if (!isGameRunning) return;

        let newX = playerPos.x + dx;
        let newY = playerPos.y + dy;

        // 1. Check boundary limits
        if (newX < 0 || newX >= COLS || newY < 0 || newY >= ROWS) {
            return;
        }

        // 2. Check for wall collision
        if (mazeMap[newY][newX] === 1) {
            messageElement.textContent = "Oops! That's a wall!";
            return;
        }

        // 3. Move the player
        playerPos.x = newX;
        playerPos.y = newY;

        const oldCell = document.getElementById(`cell-${playerPos.x - dx}-${playerPos.y - dy}`);
        const newCell = document.getElementById(`cell-${playerPos.x}-${playerPos.y}`);
        const player = document.getElementById('player');

        // Move the player div to the new cell (triggers the CSS transition)
        oldCell.removeChild(player);
        newCell.appendChild(player);

        messageElement.textContent = `Current Position: (${playerPos.x}, ${playerPos.y})`;

        // 4. Check for win condition
        if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
            winGame();
        }
    };

    const winGame = () => {
        isGameRunning = false;
        messageElement.textContent = '🎉 Congratulations! You reached the goal!';
        document.querySelector('.player').style.backgroundColor = '#69c0ff'; // Change player color for victory
    };

    // --- Input Handling ---
    
    // Desktop: Keyboard controls (Arrow Keys and WASD)
    document.addEventListener('keydown', (e) => {
        let dx = 0;
        let dy = 0;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
                dy = -1;
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
                dy = 1;
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
                dx = -1;
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
                dx = 1;
                e.preventDefault();
                break;
        }
        movePlayer(dx, dy);
    });

    // Mobile: Touch/Button controls
    controls.forEach(button => {
        button.addEventListener('click', (e) => {
            const direction = e.currentTarget.dataset.move;
            let dx = 0;
            let dy = 0;

            switch (direction) {
                case 'up':
                    dy = -1;
                    break;
                case 'down':
                    dy = 1;
                    break;
                case 'left':
                    dx = -1;
                    break;
                case 'right':
                    dx = 1;
                    break;
            }
            movePlayer(dx, dy);
        });
    });

    // --- Initialization ---
    renderMaze();
    createPlayer();
});
