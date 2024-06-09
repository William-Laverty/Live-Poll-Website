document.addEventListener('DOMContentLoaded', function() {
    const event = localStorage.getItem('currentEvent');
    if (event) {
        document.getElementById('currentEvent').textContent = `${event}`;
    } else {
        window.location.href = 'index.html'; // Redirect back if no 
    }
});