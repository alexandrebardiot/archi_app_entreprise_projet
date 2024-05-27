document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('error');

    try {
        const response = await fetch('http://localhost:9090/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log(data);
        
        // Redirigez vers la page de dashboard en passant des informations nécessaires
        window.location.href = `../dashboard/index.html?userId=${data.userId}&token=${data.token}`;
    } catch (error) {
        errorElement.textContent = 'Login failed. Please check your credentials and try again.';
    }
});
