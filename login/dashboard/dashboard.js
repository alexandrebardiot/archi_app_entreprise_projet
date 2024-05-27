document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const token = urlParams.get('token');

    if (!userId || !token) {
        window.location.href = '../index.html';
        return;
    }

    try {
        // Récupérer le solde de l'utilisateur
        const balanceResponse = await fetch(`http://localhost:9090/users/${userId}/balance`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!balanceResponse.ok) {
            throw new Error('Failed to fetch user balance');
        }

        const balanceData = await balanceResponse.json();
        document.getElementById('user-balance').textContent = `Balance: $${balanceData.balance}`;

        // Récupérer la liste des matchs
        const matchesResponse = await fetch('http://localhost:9090/matches', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!matchesResponse.ok) {
            throw new Error('Failed to fetch matches');
        }
        
        const matchesData = await matchesResponse.json(); // Déplacer cette ligne ici

        const matchesList = document.getElementById('matches-list');
        matchesData.forEach(match => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `../bet/bet.html?userId=${userId}&token=${token}&matchId=${match.id}`;
            link.textContent = `${match.team1} vs ${match.team2} - ${match.date}`;
            li.appendChild(link);
            matchesList.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        alert('Failed to load user data and matches.');
    }
});
