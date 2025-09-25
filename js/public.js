document.addEventListener('DOMContentLoaded', function() {
    loadMatches();
    // Refresh matches every 30 seconds
    setInterval(loadMatches, 30000);
});

function loadMatches() {
    fetch('includes/get_matches.php')
        .then(response => response.json())
        .then(matches => {
            const matchesList = document.getElementById('publicMatchesList');
            matchesList.innerHTML = '';
            
            matches.forEach(match => {
                const matchCard = createMatchCard(match);
                matchesList.appendChild(matchCard);
            });
        })
        .catch(error => console.error('Error:', error));
}

function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    // Add different classes based on match status
    if (match.status === 'in_progress') {
        card.classList.add('match-live');
    } else if (match.status === 'finished') {
        card.classList.add('match-finished');
    }
    
    card.innerHTML = `
        <div class="match-header">
            <span class="match-status ${match.status}">${getStatusText(match.status)}</span>
        </div>
        <div class="match-teams">
            <div class="team-score">
                <div class="team-name">${match.team_a}</div>
                <div class="score">${match.score_a}</div>
            </div>
            <div class="versus">VS</div>
            <div class="team-score">
                <div class="team-name">${match.team_b}</div>
                <div class="score">${match.score_b}</div>
            </div>
        </div>
    `;
    return card;
}

function getStatusText(status) {
    switch(status) {
        case 'pending':
            return 'Por Comenzar';
        case 'in_progress':
            return 'En Vivo';
        case 'finished':
            return 'Finalizado';
        default:
            return status;
    }
}