document.addEventListener('DOMContentLoaded', function() {
    loadMatches();
    
    // New match form handler
    document.getElementById('newMatchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const teamA = document.getElementById('teamA').value;
        const teamB = document.getElementById('teamB').value;
        
        createMatch(teamA, teamB);
    });
});

function loadMatches() {
    fetch('includes/get_matches.php')
        .then(response => response.json())
        .then(matches => {
            const matchesList = document.getElementById('matchesList');
            matchesList.innerHTML = '';
            
            matches.forEach(match => {
                const matchCard = createMatchCard(match);
                matchesList.appendChild(matchCard);
            });
        })
        .catch(error => console.error('Error:', error));
}

function createMatch(teamA, teamB) {
    fetch('includes/create_match.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamA, teamB })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            document.getElementById('newMatchForm').reset();
            loadMatches();
        }
    })
    .catch(error => console.error('Error:', error));
}

function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.innerHTML = `
        <div class="match-header">
            <span>${match.team_a} vs ${match.team_b}</span>
            <span class="match-status">${match.status}</span>
        </div>
        <div class="match-teams">
            <div class="team-score">
                <div>${match.team_a}</div>
                <div class="score">${match.score_a}</div>
            </div>
            <div class="team-score">
                <div>${match.team_b}</div>
                <div class="score">${match.score_b}</div>
            </div>
        </div>
        <div class="match-actions">
            <button onclick="updateScore(${match.id}, 'A')" class="action-btn goal-btn">Gol Equipo A</button>
            <button onclick="updateScore(${match.id}, 'B')" class="action-btn goal-btn">Gol Equipo B</button>
            <button onclick="updateStatus(${match.id}, 'in_progress')" class="action-btn status-btn">Partido Comenzado</button>
            <button onclick="updateStatus(${match.id}, 'finished')" class="action-btn status-btn">Partido Terminado</button>
        </div>
    `;
    return card;
}

function updateScore(matchId, team) {
    fetch('includes/update_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchId, team })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            loadMatches();
        }
    })
    .catch(error => console.error('Error:', error));
}

function updateStatus(matchId, status) {
    fetch('includes/update_status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchId, status })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            loadMatches();
        }
    })
    .catch(error => console.error('Error:', error));
}