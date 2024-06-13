document.addEventListener('DOMContentLoaded', function() {
    const event = localStorage.getItem('currentEvent').toLowerCase();
    if (event) {
        document.getElementById('welcomeMessage').textContent = `Your vote for ${event} has been submitted!`;
    } else {
        window.location.href = 'index.html'; 
    }
});

document.getElementById('submitted').addEventListener('submit', function(event) {
    event.preventDefault();
    window.location.href = 'results.html';
});