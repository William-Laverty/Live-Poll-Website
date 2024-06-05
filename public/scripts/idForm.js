document.getElementById('usernameForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const lastName = document.getElementById('lastName').value;

    fetch('https://3.107.27.254:443/verify-user', { // Send request to server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, lastName })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            localStorage.setItem('username', username);
            localStorage.setItem('name', data.name);
            localStorage.setItem('isAdmin', data.isAdmin);

            if (!data.isAdmin) {
                window.location.href = 'html/poll.html'; // Redirect to poll page
            } else {
                window.location.href = 'html/admin.html'; // Redirect to admin page
            }
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
