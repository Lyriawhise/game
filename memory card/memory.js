        // Audio elements
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioElements = {
            background: new Audio('/api/placeholder/400/320'),
            cardFlip: new Audio('/api/placeholder/400/320'),
            cardMatch: new Audio('/api/placeholder/400/320'),
            cardMismatch: new Audio('/api/placeholder/400/320'),
            victory: new Audio('/api/placeholder/400/320'),
            gameOver: new Audio('/api/placeholder/400/320')
        };
        
        // Set audio properties
        audioElements.background.loop = true;
        audioElements.background.volume = 0.3;
        
        // Game configuration for different difficulty levels
        const gameConfig = {
            easy: {
                rows: 4,
                cols: 4,
                pairs: 8,
                time: 90
            },
            normal: {
                rows: 5,
                cols: 6,
                pairs: 15,
                time: 120
            },
            hard: {
                rows: 6,
                cols: 6,
                pairs: 18,
                time: 150,
                moveCards: true
            }
        };
        
        // Rune symbols for cards
        const runeSymbols = [
            '᛫', '᛬', 'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 
            'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 
            'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ'
        ];
        
        // Game state
        let gameState = {
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            totalPairs: 0,
            timer: null,
            timeRemaining: 0,
            difficulty: 'easy',
            isGameRunning: false,
            cardShuffleInterval: null
        };

        // DOM elements
        const gameBoard = document.querySelector('.game-board');
        const candleMeter = document.querySelector('.candle-meter');
        const timerDisplay = document.querySelector('.timer-display');
        const scoreDisplay = document.querySelector('.score');
        const difficultyButtons = document.querySelectorAll('.btn-difficulty');
        const gameOverScreen = document.querySelector('.game-over');
        const victoryScreen = document.querySelector('.victory-screen');
        const retryButton = document.querySelector('.btn-retry');
        const playAgainButton = document.querySelector('.btn-play-again');
        const highScoresLists = document.querySelectorAll('.scores-list');
        const candle = document.querySelector('.candle');
        
        // Event listeners
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mode = button.getAttribute('data-mode');
                startGame(mode);
            });
        });
        
        retryButton.addEventListener('click', () => {
            gameOverScreen.classList.remove('active');
            startGame(gameState.difficulty);
        });
        
        playAgainButton.addEventListener('click', () => {
            victoryScreen.classList.remove('active');
            startGame(gameState.difficulty);
        });
        
        // Function to start the game
        function startGame(difficulty) {
            // Reset game state
            gameState.difficulty = difficulty;
            gameState.matchedPairs = 0;
            gameState.flippedCards = [];
            gameState.isGameRunning = true;
            
            // Set up the game based on difficulty
            const config = gameConfig[difficulty];
            gameState.totalPairs = config.pairs;
            gameState.timeRemaining = config.time;
            
            // Clear the board
            gameBoard.innerHTML = '';
            gameBoard.className = 'game-board';
            gameBoard.classList.add(`mode-${difficulty}`);
            
            // Create card array with pairs
            const selectedRunes = [...runeSymbols].slice(0, config.pairs);
            const cardPairs = [...selectedRunes, ...selectedRunes];
            gameState.cards = shuffle(cardPairs);
            
            // Create and append cards to the board
            createCards();
            
            // Start the timer
            startTimer();
            
            // Update displays
            updateScoreDisplay();
            
            // Setup card shuffling for hard mode
            if (config.moveCards && gameState.cardShuffleInterval) {
                clearInterval(gameState.cardShuffleInterval);
            }
            
if (config.moveCards) {
    gameState.cardShuffleInterval = setInterval(() => {
        if (gameState.isGameRunning) {
                shuffleVisibleCards();
            }
        }, 10000); 
    }
            
            // Reset and start audio
            try {
                audioElements.background.currentTime = 0;
                audioElements.background.play();
            } catch (error) {
                console.log("Audio playback failed:", error);
            }
        }
        
        // Function to create cards
        function createCards() {
            gameState.cards.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.index = index;
                card.dataset.symbol = symbol;
                
                // Create card back
                const cardBack = document.createElement('div');
                cardBack.className = 'card-face card-back';
                
                // Create card front
                const cardFront = document.createElement('div');
                cardFront.className = 'card-face card-front';
                
                // Create symbol element
                const symbolElement = document.createElement('div');
                symbolElement.className = 'card-symbol';
                symbolElement.textContent = symbol;
                
                // Append elements
                cardFront.appendChild(symbolElement);
                card.appendChild(cardBack);
                card.appendChild(cardFront);
                
                // Add click event
                card.addEventListener('click', handleCardClick);
                
                // Append to game board
                gameBoard.appendChild(card);
            });
        }
        
        // Function to handle card click
        function handleCardClick(event) {
            const card = event.currentTarget;
            
            // Check if the card can be flipped
            if (
                !gameState.isGameRunning ||
                gameState.flippedCards.length >= 2 ||
                card.classList.contains('flipped') ||
                card.classList.contains('matched')
            ) {
                return;
            }
            
            // Flip the card
            flipCard(card);
            
            // Play flip sound
            try {
                audioElements.cardFlip.currentTime = 0;
                audioElements.cardFlip.play();
            } catch (error) {
                console.log("Audio playback failed:", error);
            }
            
            // Add to flipped cards
            gameState.flippedCards.push(card);
            
            // Check for match if 2 cards are flipped
            if (gameState.flippedCards.length === 2) {
                setTimeout(checkForMatch, 600);
            }
        }
        
        // Function to flip a card
        function flipCard(card) {
            card.classList.add('flipped');
        }
        
        // Function to check for a match
        function checkForMatch() {
            const [card1, card2] = gameState.flippedCards;
            
            if (card1.dataset.symbol === card2.dataset.symbol) {
                // Cards match
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                // Play match sound
                try {
                    audioElements.cardMatch.currentTime = 0;
                    audioElements.cardMatch.play();
                } catch (error) {
                    console.log("Audio playback failed:", error);
                }
                
                // Update game state
                gameState.matchedPairs++;
                gameState.timeRemaining += 5; // Add 5 seconds for each match
                
                // Update display
                updateScoreDisplay();
                
                // Check for victory
                if (gameState.matchedPairs === gameState.totalPairs) {
                    setTimeout(handleVictory, 1000);
                }
            } else {
                // Cards don't match
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                }, 400);
                
                // Play mismatch sound
                try {
                    audioElements.cardMismatch.currentTime = 0;
                    audioElements.cardMismatch.play();
                } catch (error) {
                    console.log("Audio playback failed:", error);
                }
            }
            
            // Reset flipped cards
            gameState.flippedCards = [];
        }
        
        // Function to start the timer
        function startTimer() {
            // Clear any existing timer
            if (gameState.timer) {
                clearInterval(gameState.timer);
            }
            
            // Reset candle display
            candleMeter.style.height = '0%';
            candle.classList.remove('low-time');
            
            // Start new timer
            const startTime = Date.now();
            const totalTime = gameState.timeRemaining * 1000;
            
            gameState.timer = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = totalTime - elapsedTime;
                
                if (remainingTime <= 0) {
                    clearInterval(gameState.timer);
                    handleGameOver();
                    return;
                }
                
                // Update time remaining
                gameState.timeRemaining = Math.ceil(remainingTime / 1000);
                
                // Update candle display
                const percentBurned = (elapsedTime / totalTime) * 100;
                candleMeter.style.height = `${percentBurned}%`;
                
                // Update timer display
                updateTimerDisplay();
                
                // Add warning class when time is running low
                if (gameState.timeRemaining <= 15 && !candle.classList.contains('low-time')) {
                    candle.classList.add('low-time');
                }
            }, 100);
        }
        
        // Function to update the timer display
        function updateTimerDisplay() {
            const minutes = Math.floor(gameState.timeRemaining / 60);
            const seconds = gameState.timeRemaining % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Function to update the score display
        function updateScoreDisplay() {
            scoreDisplay.textContent = `Pairs: ${gameState.matchedPairs}/${gameState.totalPairs}`;
        }
        
        // Function to handle game over
        function handleGameOver() {
            gameState.isGameRunning = false;
            
            // Stop any intervals
            if (gameState.cardShuffleInterval) {
                clearInterval(gameState.cardShuffleInterval);
            }
            
            // Play game over sound
            try {
                audioElements.background.pause();
                audioElements.gameOver.currentTime = 0;
                audioElements.gameOver.play();
            } catch (error) {
                console.log("Audio playback failed:", error);
            }
            
            // Save and display high scores
            saveScore();
            displayHighScores();
            
            // Show game over screen
            gameOverScreen.classList.add('active');
        }
        
        // Function to handle victory
        function handleVictory() {
            gameState.isGameRunning = false;
            
            // Stop timer
            clearInterval(gameState.timer);
            
            // Stop any intervals
            if (gameState.cardShuffleInterval) {
                clearInterval(gameState.cardShuffleInterval);
            }
            
            // Play victory sound
            try {
                audioElements.background.pause();
                audioElements.victory.currentTime = 0;
                audioElements.victory.play();
            } catch (error) {
                console.log("Audio playback failed:", error);
            }
            
            // Save and display high scores
            saveScore();
            displayHighScores();
            
            // Show victory screen
            victoryScreen.classList.add('active');
        }
        
        // Function to save score
        function saveScore() {
            const scores = getHighScores();
            const newScore = {
                difficulty: gameState.difficulty,
                pairs: gameState.matchedPairs,
                time: gameConfig[gameState.difficulty].time - gameState.timeRemaining,
                timestamp: Date.now()
            };
            
            scores.push(newScore);
            scores.sort((a, b) => {
                // Sort first by difficulty (hard > normal > easy)
                const difficultyOrder = { hard: 3, normal: 2, easy: 1 };
                if (difficultyOrder[a.difficulty] !== difficultyOrder[b.difficulty]) {
                    return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
                }
                
                // Then by pairs found
                if (a.pairs !== b.pairs) {
                    return b.pairs - a.pairs;
                }
                
                // Then by time (faster is better)
                return a.time - b.time;
            });
            
            // Keep only top 5 scores
            const topScores = scores.slice(0, 5);
            localStorage.setItem('darkRitualMemoryScores', JSON.stringify(topScores));
        }
        
        // Function to get high scores
        function getHighScores() {
            const scoresJSON = localStorage.getItem('darkRitualMemoryScores');
            return scoresJSON ? JSON.parse(scoresJSON) : [];
        }
        
        // Function to display high scores
        function displayHighScores() {
            const scores = getHighScores();
            
            highScoresLists.forEach(list => {
                list.innerHTML = '';
                
                if (scores.length === 0) {
                    const li = document.createElement('li');
                    li.textContent = 'No scores yet';
                    list.appendChild(li);
                    return;
                }
                
                scores.forEach((score, index) => {
                    const li = document.createElement('li');
                    
                    const difficultySpan = document.createElement('span');
                    difficultySpan.textContent = `${score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1)}`;
                    
                    const scoreSpan = document.createElement('span');
                    const minutes = Math.floor(score.time / 60);
                    const seconds = score.time % 60;
                    scoreSpan.textContent = `${score.pairs}/${gameConfig[score.difficulty].pairs} in ${minutes}:${seconds.toString().padStart(2, '0')}`;
                    
                    li.appendChild(difficultySpan);
                    li.appendChild(scoreSpan);
                    list.appendChild(li);
                });
            });
        }
        
        // Function to shuffle an array (Fisher-Yates algorithm)
        function shuffle(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }
        
        // Function to shuffle visible cards in hard mode
        function shuffleVisibleCards() {
            // Get all cards that are not matched
            const unmatched = Array.from(document.querySelectorAll('.card:not(.matched)'));
            
            if (unmatched.length <= 2) return; // Don't shuffle if only 2 or fewer cards remain
            
            // Remember flipped cards
            const flippedIndices = unmatched.filter(card => card.classList.contains('flipped'))
                .map(card => unmatched.indexOf(card));
            
            // Shuffle the DOM elements
            for (let i = unmatched.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                
                // Get current positions
                const rect1 = unmatched[i].getBoundingClientRect();
                const rect2 = unmatched[j].getBoundingClientRect();
                
                // Animate the swap
                const tempHtml = unmatched[i].innerHTML;
                const tempSymbol = unmatched[i].dataset.symbol;
                const tempIndex = unmatched[i].dataset.index;
                
                // Swap the card contents and data
                unmatched[i].innerHTML = unmatched[j].innerHTML;
                unmatched[i].dataset.symbol = unmatched[j].dataset.symbol;
                unmatched[i].dataset.index = unmatched[j].dataset.index;
                
                unmatched[j].innerHTML = tempHtml;
                unmatched[j].dataset.symbol = tempSymbol;
                unmatched[j].dataset.index = tempIndex;
            }
            
            // Keep previously flipped cards flipped
            flippedIndices.forEach(index => {
                if (index >= 0) {
                    unmatched[index].classList.add('flipped');
                }
            });
        }
        
        // Create mobile-friendly candle lights
        function createCandleLights() {
            const numLights = 5;
            const container = document.querySelector('.game-container');
            
            for (let i = 0; i < numLights; i++) {
                const candleContainer = document.createElement('div');
                candleContainer.className = 'candle-container';
                
                const light = document.createElement('div');
                light.className = 'candle-light';
                
                // Position randomly around the edges
                const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
                
                let top, left;
                
                switch (side) {
                    case 0: // top
                        top = '-20px';
                        left = `${Math.random() * 100}%`;
                        break;
                    case 1: // right
                        top = `${Math.random() * 100}%`;
                        left = 'calc(100% + 20px)';
                        break;
                    case 2: // bottom
                        top = 'calc(100% + 20px)';
                        left = `${Math.random() * 100}%`;
                        break;
                    case 3: // left
                        top = `${Math.random() * 100}%`;
                        left = '-20px';
                        break;
                }
                
                candleContainer.style.top = top;
                candleContainer.style.left = left;
                
                candleContainer.appendChild(light);
                container.appendChild(candleContainer);
            }
        }
        
        // Initialize the game when the page loads
        window.addEventListener('DOMContentLoaded', () => {
            createCandleLights();
            startGame('easy');
            
            // Initialize audio to work around autoplay restrictions
            document.addEventListener('click', () => {
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
            }, { once: true });
        });
        
        // Add responsive design for mobile devices
        function handleResize() {
            const gameContainer = document.querySelector('.game-container');
            if (window.innerWidth < 768) {
                gameContainer.style.width = '95%';
            } else {
                gameContainer.style.width = '90%';
            }
        }
        
        window.addEventListener('resize', handleResize);
        handleResize();
