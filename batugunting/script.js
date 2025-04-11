let userScore = 0;
let computerScore = 0;
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result p");
const rock_button = document.getElementById("rock");
const paper_button = document.getElementById("paper");
const scissors_button = document.getElementById("scissors");
const playerChoice_div = document.getElementById("player-choice");
const computerChoice_div = document.getElementById("computer-choice");

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomNumber = Math.floor(Math.random() * 3);
    return choices[randomNumber];
}

function convertToEmoji(choice) {
    if (choice === "rock") return "🪨 Batu";
    if (choice === "paper") return "📜 Kertas";
    return "✂️ Gunting";
}

function win(userChoice, computerChoice) {
    userScore++;
    userScore_span.innerHTML = userScore;
    result_p.innerHTML = "Kamu Menang! 🎉";
    document.getElementById(userChoice).classList.add('green-glow');
    setTimeout(() => document.getElementById(userChoice).classList.remove('green-glow'), 800);
}

function lose(userChoice, computerChoice) {
    computerScore++;
    computerScore_span.innerHTML = computerScore;
    result_p.innerHTML = "Kamu Kalah! 😢";
    document.getElementById(userChoice).classList.add('red-glow');
    setTimeout(() => document.getElementById(userChoice).classList.remove('red-glow'), 800);
}

function draw(userChoice, computerChoice) {
    result_p.innerHTML = "Seri! 🤝";
    document.getElementById(userChoice).classList.add('gray-glow');
    setTimeout(() => document.getElementById(userChoice).classList.remove('gray-glow'), 800);
}

function game(userChoice) {
    const computerChoice = getComputerChoice();
    playerChoice_div.innerHTML = convertToEmoji(userChoice);
    computerChoice_div.innerHTML = convertToEmoji(computerChoice);
    
    switch (userChoice + computerChoice) {
        case "rockscissors":
        case "paperrock":
        case "scissorspaper":
            win(userChoice, computerChoice);
            break;
        case "rockpaper":
        case "paperscissors":
        case "scissorsrock":
            lose(userChoice, computerChoice);
            break;
        case "rockrock":
        case "paperpaper":
        case "scissorsscissors":
            draw(userChoice, computerChoice);
            break;
    }
}

function main() {
    rock_button.addEventListener('click', () => game("rock"));
    paper_button.addEventListener('click', () => game("paper"));
    scissors_button.addEventListener('click', () => game("scissors"));
}

// Tambahkan animasi ketika halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    const choices = document.querySelectorAll('.choice');
    choices.forEach((choice, index) => {
        setTimeout(() => {
            choice.style.opacity = '0';
            choice.style.transform = 'scale(0.5)';
            choice.style.display = 'flex';
            
            setTimeout(() => {
                choice.style.transition = 'all 0.5s ease';
                choice.style.opacity = '1';
                choice.style.transform = 'scale(1)';
            }, 50);
        }, index * 200);
    });
});

main();
