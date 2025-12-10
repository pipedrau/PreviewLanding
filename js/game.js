// Teams Data
const teams = [
    { id: 'aguilas', name: 'Águilas Cibaeñas', file: 'Aguilas-Cibaenas.png' },
    { id: 'estrellas', name: 'Estrellas Orientales', file: 'Estrellas Orientales.png' },
    { id: 'gigantes', name: 'Gigantes del Cibao', file: 'Gigantes-del-cibao.png' },
    { id: 'leones', name: 'Leones del Escogido', file: 'Leones-del-Escogido.png' },
    { id: 'tigres', name: 'Tigres del Licey', file: 'Tigres-del-Licey.png' },
    { id: 'toros', name: 'Toros del Este', file: 'Toros-del-este.png' }
];

let currentCorrectTeam = null;
let gameActive = true;

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize Game
function initGame() {
    gameActive = true;
    
    // Reset any revealed cards
    document.querySelectorAll('.team-card').forEach(card => {
        card.classList.remove('revealed', 'correct', 'incorrect');
    });

    // Select 3 random teams
    const shuffledTeams = shuffleArray(teams);
    const selectedTeams = shuffledTeams.slice(0, 3);

    // Select one of the 3 as the correct answer
    const correctIndex = Math.floor(Math.random() * 3);
    currentCorrectTeam = selectedTeams[correctIndex];

    // Update question
    document.getElementById('team-question').textContent = currentCorrectTeam.name;

    // Shuffle the display order of the 3 teams
    const displayTeams = shuffleArray(selectedTeams);

    // Render team cards
    const container = document.getElementById('teams-container');
    container.innerHTML = '';

    displayTeams.forEach(team => {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.setAttribute('data-team-id', team.id);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Escudo oculto - Seleccionar si crees que es ${currentCorrectTeam.name}`);

        const img = document.createElement('img');
        img.src = `Assets/Equipos/${team.file}`;
        img.alt = 'Escudo oculto';

        card.appendChild(img);
        card.addEventListener('click', () => handleTeamClick(team, card));
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleTeamClick(team, card);
            }
        });

        container.appendChild(card);
    });
}

// Handle team card click
function handleTeamClick(team, card) {
    if (!gameActive) return;
    
    gameActive = false;

    // Reveal all cards
    document.querySelectorAll('.team-card').forEach(c => {
        c.classList.add('revealed');
    });

    const resultMessage = document.getElementById('result-message');
    const resultText = document.getElementById('result-text');

    if (team.id === currentCorrectTeam.id) {
        // Correct answer
        card.classList.add('correct');
        resultMessage.classList.remove('error');
        resultMessage.classList.add('success');
        resultText.textContent = 'FELICIDADES, ERES UN FIEL SEGUIDOR DE LA LIDOM';
    } else {
        // Incorrect answer
        card.classList.add('incorrect');
        
        // Highlight the correct answer
        document.querySelector(`[data-team-id="${currentCorrectTeam.id}"]`).classList.add('correct');
        
        resultMessage.classList.remove('success');
        resultMessage.classList.add('error');
        resultText.textContent = 'Ups, fallaste. Inténtalo de nuevo';
    }

    // Show result after a short delay
    setTimeout(() => {
        resultMessage.classList.add('show');
    }, 800);
}

// Retry button handler
document.getElementById('retry-button').addEventListener('click', () => {
    document.getElementById('result-message').classList.remove('show');
    setTimeout(initGame, 300);
});

// Initialize game on load
document.addEventListener('DOMContentLoaded', initGame);

