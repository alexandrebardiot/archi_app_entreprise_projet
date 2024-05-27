document.addEventListener('DOMContentLoaded', async function() {
    // Récupérer les paramètres de l'URL (userId, token, matchId)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const token = urlParams.get('token');
    const matchId = urlParams.get('matchId');

    if (!userId || !token || !matchId) {
        // Rediriger l'utilisateur vers la page de connexion s'il manque des paramètres
        window.location.href = '../index.html';
        return;
    }

    try {
        // Récupérer les détails du match
        const matchResponse = await fetch(`http://localhost:9090/matches/${matchId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!matchResponse.ok) {
            throw new Error('Failed to fetch match details');
        }

        const matchData = await matchResponse.json();
        const matchDetails = document.getElementById('match-details');
        matchDetails.textContent = `Match: ${matchData.team1} vs ${matchData.team2}`;

        // Récupérer les options de pari pour le match sélectionné
        const betOptionsResponse = await fetch(`http://localhost:9090/matches/${matchId}/bet-options`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!betOptionsResponse.ok) {
            throw new Error('Failed to fetch bet options');
        }

        const betOptionsData = await betOptionsResponse.json();
        const betOptionsSelect = document.getElementById('bet-option');
        
        betOptionsData.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.id;
            optionElement.textContent = `${option.name} - Odds: ${option.odds}`;
            betOptionsSelect.appendChild(optionElement);
        });

        // Ajouter un écouteur d'événements au bouton de placement de pari
        const placeBetButton = document.getElementById('place-bet');
        placeBetButton.addEventListener('click', async function() {
            const selectedOption = betOptionsSelect.value;
            const betAmount = document.getElementById('bet-amount').value;

            if (!selectedOption || !betAmount) {
                alert('Please select a bet option and enter a bet amount.');
                return;
            }

            // Envoyer le pari au backend
            const betData = {
                userId: userId,
                matchId: matchId,
                betOptionId: selectedOption,
                amount: betAmount
            };

            const response = await fetch('http://localhost:9090/place-bet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(betData)
            });

            if (!response.ok) {
                throw new Error('Failed to place bet');
            }

            alert('Bet placed successfully!');
        });
    } catch (error) {
        console.error(error);
        alert('Failed to load match details and bet options.');
    }
});
