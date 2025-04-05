document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('resetBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const winnerModal = document.getElementById('winnerModal');
    const winnerText = document.getElementById('winnerText');
    const winnerIcon = document.getElementById('winnerIcon');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const scoreX = document.getElementById('scoreX');
    const scoreO = document.getElementById('scoreO');
    const scoreDraw = document.getElementById('scoreDraw');
    const themeToggle = document.getElementById('themeToggle');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const overlay = document.getElementById('overlay');
    const soundToggle = document.getElementById('soundToggle');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Game State
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;
    let scores = {
        X: 0,
        O: 0,
        draw: 0
    };
    let soundEnabled = true;
    let difficulty = "easy";
    let isComputerEnabled = false;

    // Sound effects
    const clickSound = new Audio();
    clickSound.src = "data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFzb25pY1N0dWRpb3MuY29tAFRDT04AAAAVAAADZWdpc190eXBlAG1wMysxOTJrYnBzAFRTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAoAAAyAAEiIiIiIiIiIiIiIiIiIjw8PDw8PDw8PDw8PDw8XFxcXFxcXFxcXFxcXFx2dnZ2dnZ2dnZ2dnZ2dpaWlpaWlpaWlpaWlpaWsLCwsLCwsLCwsLCwsLDKysrKysrKysrKysrKyuTk5OTk5OTk5OTk5OTk/v7+/v7+/v7+/v7+/v4AAAA5TEFNRTMuMTAwBK8AAAAALnUAABRAJAj6QgAAQAAATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+0DEAAP9AAIJAAAAAAAAA2wAAABAAAAAAAAAAAAAAAAAACAAH/gAOmAAwAAAAAAiD///wIWBoOXAEKCgdEG3xAb//CCuQOAtHbv//p3h5KSzJ3/+tDIiMjP/8nIjbDafJE7u9nf//83dou7JGRLQhgAEAZAL/+0DEAIP3MG7tBgRJIUcNHmDGeMDghggTwRADKAABkPt+LxIBwuHfFsOxOJVVeVi9t3nLzr/4ywcGYrF55+P/13nIE7WOBw+i8W5Hhc5O+W177tV9NWGhfkEv8u2ztXWxN9qlD6Lx4P/7QMQBgPrQbm0GJGkhWw2aYMR5kNJrUqnG5mMxmLMrF36lLZo31IZd/oGnZTFRXPJYjC/lbtPGcRJzHSQUAYFCYdkFCr7YVl7Mxe+4KQM1GxpLkXakVdB8MqZMajXPQdJ+pWiJsAAeUxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
    
    const winSound = new Audio();
    winSound.src = "data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFzb25pY1N0dWRpb3MuY29tAFRDT04AAAAVAAADZWdpc190eXBlAG1wMysxOTJrYnBzAFRTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAoAAAyAAEiIiIiIiIiIiIiIiIiIjw8PDw8PDw8PDw8PDw8XFxcXFxcXFxcXFxcXFx2dnZ2dnZ2dnZ2dnZ2dpaWlpaWlpaWlpaWlpaWsLCwsLCwsLCwsLCwsLDKysrKysrKysrKysrKyuTk5OTk5OTk5OTk5OTk/v7+/v7+/v7+/v7+/v4AAAA5TEFNRTMuMTAwBK8AAAAALnUAABRAJAj6QgAAQAAATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+0DEAAP9AAIJAAAAAAAAA2wAAABAAAAAAAAAAAAAAAAAACAAH/gAOmAAwAAAAAAiD///wIWBoOXAEKCgdEG3xAb//CCuQOAtHbv//p3h5KSzJ3/+tDIiMjP/8nIjbDafJE7u9nf//83dou7JGRLQhgAEAZALgJAGCnSG4GBoRjW7AxFQHBMBwbGvt3m5G5CXb//7QMQJg/pYdtUGM8TBWozZ8M548Oc6R4CJZdxJHLWfvZucXPYYb14bnDc9GvRfG21DH/OWp5XDuRNrvt9Z9uBNqnD6+R7zy5yjrOC4XC4DRSUDnC6yKXM9jkfn6GUWFkFAFChQkv/7QMQKAPqscLkGV8uBWA0bIMb5caBqHQIRLnBADEAxcmxO+KBE3xDOGnKQNuRsK8R4aCYUHXjnLYHVEpYqlh4E53sPUJIlxaPLDkDYzgDt5w7k6fUDZGBiCGHLRUFRETjuG1FKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
    
    const drawSound = new Audio();
    drawSound.src = "data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFzb25pY1N0dWRpb3MuY29tAFRDT04AAAAVAAADZWdpc190eXBlAG1wMysxOTJrYnBzAFRTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAoAAAyAAEiIiIiIiIiIiIiIiIiIjw8PDw8PDw8PDw8PDw8XFxcXFxcXFxcXFxcXFx2dnZ2dnZ2dnZ2dnZ2dpaWlpaWlpaWlpaWlpaWsLCwsLCwsLCwsLCwsLDKysrKysrKysrKysrKyuTk5OTk5OTk5OTk5OTk/v7+/v7+/v7+/v7+/v4AAAA5TEFNRTMuMTAwBK8AAAAALnUAABRAJAj6QgAAQAAATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+0DEAAP9AAIJAAAAAAAAA2wAAABAAAAAAAAAAAAAAAAAACAAH/gAOmAAwAAAAAAiD///wIWBoOXAEKCgdEG3xAb//CCuQOAtHbv//p3h5KSzJ3/+tDIiMjP/8nIjbDafJE7u9nf//83dou7JGRLQhgAEAZALgHAQBoYDBAsgCDYQCIEQoGBEYLQeGAUXRcYIAyGA0BgkGA//+0DEBQPtGGi9B9vCQUMM2qDKeMCCgYKggTEgAQAAIAG4AgAAS6tERRSs0XTk6LBdkF9WpK/KWxlZTxOUy5XyMYXQ+0T43jjDGbUu0y5XBcR1rLqYVRldbbdTXcnM44KA8PAYKEvCM//7QMQHAPn0aL0HzkFBTAyZoMZ5cDQTzYcHAoHwMCRYEAGFAJDwVKwFBcDALDACBA2AYKEACDwXA2AwLNwQgJBIyTBuWF+Y9yhUpX2WF5SRVFZOxYRp6ldx6FtZXURjsjf6/N9qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";

    // Winning Conditions
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Initialize Game
    function initGame() {
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
            cell.classList.remove('x', 'o', 'win');
        });
        resetBtn.addEventListener('click', resetGame);
        newGameBtn.addEventListener('click', newGame);
        playAgainBtn.addEventListener('click', closeModal);
        themeToggle.addEventListener('click', toggleTheme);
        settingsBtn.addEventListener('click', openSettings);
        closeSettings.addEventListener('click', closeSettingsPanel);
        overlay.addEventListener('click', closeSettingsPanel);
        soundToggle.addEventListener('change', toggleSound);
        
        document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                difficulty = e.target.value;
            });
        });

        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                changeColorTheme(theme);
            });
        });

        updateScoreDisplay();
    }

    // Cell Click Handler
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        playSound(clickSound);
        updateCell(clickedCell, clickedCellIndex);
        checkResult();

        // Add computer player if enabled
        if (gameActive && isComputerEnabled && currentPlayer === "O") {
            setTimeout(() => {
                makeComputerMove();
            }, 500);
        }
    }

    // Update Cell
    function updateCell(cell, index) {
        gameState[index] = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        cell.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Check Result
    function checkResult() {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] !== "" && 
                gameState[a] === gameState[b] && 
                gameState[a] === gameState[c]) {
                roundWon = true;
                winningLine = [a, b, c];
                break;
            }
        }

        if (roundWon) {
            if (soundEnabled) {
                winSound.play();
            }
            highlightWinningCells(winningLine);
            updateScore(currentPlayer);
            showWinnerModal(`Player ${currentPlayer} wins!`, currentPlayer);
            gameActive = false;
            return;
        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            if (soundEnabled) {
                drawSound.play();
            }
            updateScore('draw');
            showWinnerModal("It's a draw!", "draw");
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        // Add animation to status
        status.style.transform = "scale(1.1)";
        setTimeout(() => {
            status.style.transform = "scale(1)";
        }, 200);
    }

    // Highlight Winning Cells
    function highlightWinningCells(cells) {
        cells.forEach(index => {
            document.querySelector(`[data-cell-index="${index}"]`).classList.add('win');
        });
    }

    // Update Score
    function updateScore(winner) {
        if (winner === 'X') {
            scores.X++;
        } else if (winner === 'O') {
            scores.O++;
        } else {
            scores.draw++;
        }
        updateScoreDisplay();
    }

    // Update Score Display
    function updateScoreDisplay() {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
        scoreDraw.textContent = scores.draw;
    }

    // Show Winner Modal
    function showWinnerModal(message, winner) {
        winnerText.textContent = message;
        
        if (winner === "X") {
            winnerIcon.textContent = "❌";
            winnerIcon.className = "winner-icon player-x";
        } else if (winner === "O") {
            winnerIcon.textContent = "⭕";
            winnerIcon.className = "winner-icon player-o";
        } else {
            winnerIcon.textContent = "🤝";
            winnerIcon.className = "winner-icon";
        }
        
        winnerModal.classList.add('active');
        createConfetti();
    }

    // Close Modal
    function closeModal() {
        winnerModal.classList.remove('active');
        resetGame();
    }

    // Reset Game
    function resetGame() {
        gameState = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentPlayer = "X";
        
        cells.forEach(cell => {
            cell.className = "cell";
        });
        
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        if (isComputerEnabled && currentPlayer === "O") {
            setTimeout(() => {
                makeComputerMove();
            }, 500);
        }
    }

    // New Game
    function newGame() {
        resetGame();
        scores = { X: 0, O: 0, draw: 0 };
        updateScoreDisplay();
    }

    // Toggle Theme
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        themeToggle.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    }

    // Create Confetti
    function createConfetti() {
        const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'),
            '#ffffff'
        ];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

    // Open Settings Panel
    function openSettings() {
        settingsPanel.classList.add('active');
        overlay.classList.add('active');
    }

    // Close Settings Panel
    function closeSettingsPanel() {
        settingsPanel.classList.remove('active');
        overlay.classList.remove('active');
    }

    // Toggle Sound
    function toggleSound() {
        soundEnabled = soundToggle.checked;
    }

    // Change Color Theme
    function changeColorTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'purple-blue') {
            root.style.setProperty('--primary-color', '#7e22ce');
            root.style.setProperty('--secondary-color', '#0ea5e9');
        } else if (theme === 'green-yellow') {
            root.style.setProperty('--primary-color', '#10b981');
            root.style.setProperty('--secondary-color', '#fbbf24');
        } else if (theme === 'red-pink') {
            root.style.setProperty('--primary-color', '#ef4444');
            root.style.setProperty('--secondary-color', '#ec4899');
        }
    }

    // Play Sound
    function playSound(sound) {
        if (soundEnabled) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    // Computer AI
    function makeComputerMove() {
        if (!gameActive) return;
        
        let move;
        
        switch(difficulty) {
            case 'easy':
                move = getRandomMove();
                break;
            case 'medium':
                move = Math.random() > 0.5 ? getBestMove() : getRandomMove();
                break;
            case 'hard':
                move = getBestMove();
                break;
            default:
                move = getRandomMove();
        }
        
        const cell = document.querySelector(`[data-cell-index="${move}"]`);
        playSound(clickSound);
        updateCell(cell, move);
        checkResult();
    }

    // Get Random Move
    function getRandomMove() {
        const availableMoves = gameState.map((cell, index) => {
            if (cell === "") return index;
            return null;
        }).filter(cell => cell !== null);
        
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Get Best Move (Minimax Algorithm)
    function getBestMove() {
        // First check if computer can win in one move
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === "") {
                gameState[i] = "O";
                if (checkWin("O")) {
                    gameState[i] = "";
                    return i;
                }
                gameState[i] = "";
            }
        }
        
        // Then check if player can win in one move and block
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === "") {
                gameState[i] = "X";
                if (checkWin("X")) {
                    gameState[i] = "";
                    return i;
                }
                gameState[i] = "";
            }
        }
        
        // Take center if available
        if (gameState[4] === "") {
            return 4;
        }
        
        // Take corners if available
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => gameState[corner] === "");
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available spot
        return getRandomMove();
    }

    // Check Win for AI
    function checkWin(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] === player && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return true;
            }
        }
        return false;
    }

    // Toggle Computer Player
    function toggleComputer() {
        isComputerEnabled = !isComputerEnabled;
        if (isComputerEnabled && currentPlayer === "O") {
            setTimeout(() => {
                makeComputerMove();
            }, 500);
        }
    }

    // Add settings option for computer player
    const computerOption = document.createElement('div');
    computerOption.className = 'settings-option';
    computerOption.innerHTML = `
        <h3>Play Against Computer</h3>
        <div class="difficulty-toggle">
            <input type="checkbox" id="computerToggle">
            <label for="computerToggle">Enable Computer Opponent</label>
        </div>
    `;
    
    settingsPanel.insertBefore(computerOption, settingsPanel.querySelector('.settings-option:last-child'));
    const computerToggle = document.getElementById('computerToggle');
    computerToggle.addEventListener('change', () => {
        isComputerEnabled = computerToggle.checked;
        if (isComputerEnabled && currentPlayer === "O") {
            setTimeout(() => {
                makeComputerMove();
            }, 500);
        }
    });

    // Initialize Game
    initGame();
});
