document.addEventListener('DOMContentLoaded', function() {
    loadMatches();
    loadSupportCounts();
    if (document.getElementById('visitorStats')) {
        loadVisitorStats();
        setInterval(loadVisitorStats, 60000); // Actualizar cada minuto
    }
    // Refresh matches and support counts every 30 seconds
    setInterval(() => {
        loadMatches();
        loadSupportCounts();
    }, 30000);
});

function updateSupportCounts(matchId, counts) {
    Object.keys(counts).forEach(team => {
        const countElement = document.getElementById(`supportCount${team}_${matchId}`);
        if (countElement) {
            countElement.textContent = counts[team];
        }
    });
}

function loadSupportCounts() {
    fetch(document.baseURI + 'includes/get_support_counts.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.counts) {
                Object.entries(data.counts).forEach(([matchId, counts]) => {
                    updateSupportCounts(matchId, counts);
                });
            } else if (data.error) {
                console.error('Error al cargar conteos:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
}

function loadMatches() {
    fetch(document.baseURI + 'includes/get_matches.php')
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

// Función para apoyar a un equipo
function supportTeam(matchId, teamId) {
    const button = document.getElementById(`support${teamId}_${matchId}`);
    if (button) {
        button.disabled = true;
    }

    fetch(document.baseURI + 'includes/support_team.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ match_id: matchId, team_id: teamId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            if (data.timeLeft) {
                setTimeout(() => {
                    if (button) button.disabled = false;
                }, data.timeLeft * 1000);
            } else {
                if (button) button.disabled = false;
            }
        } else if (data.success && data.counts) {
            updateSupportCounts(matchId, data.counts);
            setTimeout(() => {
                if (button) button.disabled = false;
            }, 300000); // 5 minutos
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (button) button.disabled = false;
        alert('Error al procesar el apoyo');
    });
}

function loadVisitorStats() {
    fetch(document.baseURI + 'includes/get_visitor_stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('todayVisitors').textContent = data.today;
                document.getElementById('totalVisitors').textContent = data.total;
                document.getElementById('lastUpdate').textContent = new Date(data.lastUpdate).toLocaleString();
            } else {
                throw new Error(data.error || 'Error al cargar estadísticas');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('todayVisitors').textContent = 'Error';
            document.getElementById('totalVisitors').textContent = 'Error';
            document.getElementById('lastUpdate').textContent = 'Error al cargar';
        });
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
        <div class="support-container">
            <div class="support-section">
                <button class="support-button" onclick="supportTeam(${match.id}, 'A')" id="supportA_${match.id}">
                    <span class="support-icon">👏</span>
                    <span class="support-count" id="supportCountA_${match.id}">0</span>
                </button>
            </div>
            <div class="support-section">
                <button class="support-button" onclick="supportTeam(${match.id}, 'B')" id="supportB_${match.id}">
                    <span class="support-icon">👏</span>
                    <span class="support-count" id="supportCountB_${match.id}">0</span>
                </button>
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