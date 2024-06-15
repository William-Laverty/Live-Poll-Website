document.getElementById('usernameForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const lastName = document.getElementById('lastName').value;

    fetch('https://3.107.27.254:443/verify-user', { 
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
                window.location.href = 'html/poll.html'; 
            } else {
                window.location.href = 'html/admin.html';
            }
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const heroCover = document.getElementById('heroCover');
    const logoNavbar = document.getElementById('logoNavbar');
    const usernameForm = document.getElementById('usernameForm');
    const formLogo = document.querySelector('.form-logo');

    // Step 1: Animate the gradient in
    heroCover.style.opacity = 1;

    // Step 2: Fade in the CGS logo
    setTimeout(() => {
        logoNavbar.style.opacity = 1;
    }, 2000); // Delay for 2 seconds after the gradient is fully visible

    // Step 3: Fade out the center logo and fade in the form
    setTimeout(() => {
        logoNavbar.style.opacity = 0;
        setTimeout(() => {
            logoNavbar.classList.add('hidden');
            usernameForm.style.opacity = 1;
            usernameForm.classList.remove('hidden');
            formLogo.style.opacity = 1; // Show the logo inside the form
        }, 2000); // Delay for the logo fade-out transition
    }, 4000); // Delay for another 2 seconds after the logo is fully visible
});
