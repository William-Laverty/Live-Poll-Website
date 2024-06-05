document.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('name');
    if (name) {
        document.getElementById('welcomeMessage').textContent = `Welcome, ${name}`;
    } else {
        window.location.href = 'index.html'; // Redirect back if no name
    }

    function fetchCurrentEvent() {
        fetch('https://3.107.27.254:443/current-event')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch current event');
                }
                return response.json();
            })
            .then(data => {
                if (data.success && data.currentEvent) {
                    const currentEvent = data.currentEvent.id;  
                    localStorage.setItem('currentEvent', currentEvent);
                    document.getElementById('currentEvent').textContent = `${currentEvent}`;
                } else {
                    document.getElementById('currentEvent').textContent = 'Event not set';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('currentEvent').textContent = 'Error fetching event';
            });
    }

    fetchCurrentEvent();

    document.getElementById('pollForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const selectedOption = document.querySelector('input[name="pollOption"]:checked');
        if (selectedOption) {
            const eventId = selectedOption.value;
            fetch('https://3.107.27.254:443/update-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventId })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update current event');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Current event updated successfully');
                    fetchCurrentEvent();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while updating the current event');
            });
        } else {
            alert('Please select an event.');
        }
    });
});
