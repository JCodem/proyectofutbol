document.addEventListener('DOMContentLoaded', function() {
    loadMatches();
    checkNewMatchesEnabled();
    loadVisitorStats();
    // Actualizar estadísticas cada 5 minutos
    setInterval(loadVisitorStats, 300000);
    
    // New match form handler
    document.getElementById('newMatchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const teamA = document.getElementById('teamA').value;
        const teamB = document.getElementById('teamB').value;
        
        createMatch(teamA, teamB);
    });
});

function loadVisitorStats() {
    console.log('Cargando estadísticas de visitantes...');
    fetch(document.baseURI + 'includes/get_visitor_stats.php')
        .then(response => response.json())
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data.error) {
                console.error('Error en los datos:', data.error);
                return;
            }
            document.getElementById('todayVisitors').textContent = data.today || '0';
            document.getElementById('totalVisitors').textContent = data.total || '0';
            document.getElementById('lastUpdate').textContent = data.lastUpdate ? 
                new Date(data.lastUpdate).toLocaleString() : 'No disponible';
        })
        .catch(error => {
            console.error('Error al cargar estadísticas:', error);
            document.getElementById('todayVisitors').textContent = 'Error';
            document.getElementById('totalVisitors').textContent = 'Error';
            document.getElementById('lastUpdate').textContent = 'Error al cargar';
        });
}

function checkNewMatchesEnabled() {
    fetch(document.baseURI + 'includes/get_system_config.php')
        .then(response => response.json())
        .then(config => {
            const form = document.getElementById('newMatchForm');
            const inputs = form.getElementsByTagName('input');
            const button = form.querySelector('button');
            
            if (config.enable_new_matches === '0') {
                form.classList.add('disabled');
                Array.from(inputs).forEach(input => input.disabled = true);
                button.disabled = true;
                form.insertAdjacentHTML('beforeend', '<div class="disabled-message">La creación de nuevos partidos está deshabilitada</div>');
            }
        })
        .catch(error => console.error('Error:', error));
}

function loadMatches() {
    fetch(document.baseURI + 'includes/get_matches.php')
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
    fetch(document.baseURI + 'includes/create_match.php', {
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
    fetch(document.baseURI + 'includes/update_score.php', {
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
    fetch(document.baseURI + 'includes/update_status.php', {
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