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
                    const currentEvent = data.currentEvent;  
                    localStorage.setItem('currentEvent', currentEvent.id);
                    document.getElementById('currentEvent').textContent = `${currentEvent.id}`; 
                    fetchPollOptions(currentEvent.id); 
                } else {
                    document.getElementById('currentEvent').textContent = 'Event not set';
                }
            })            
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('currentEvent').textContent = 'Error fetching event';
            });
    }

    function fetchPollOptions(eventId) {
        fetch(`https://3.107.27.254:443/poll-options/${eventId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch poll options (status ${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success && data.options) {
                    const pollOptionsContainer = document.getElementById('pollOptionsContainer');
                    pollOptionsContainer.innerHTML = ''; // Clear previous options
                    data.options.forEach(option => {
                        // Create a div for each poll option
                        const pollOptionDiv = document.createElement('div');
                        pollOptionDiv.classList.add('poll-option');
            
                        // Create the radio input element
                        const input = document.createElement('input');
                        input.setAttribute('type', 'radio');
                        input.setAttribute('name', 'pollOption');
                        input.setAttribute('value', option);
            
                        // Create the label element
                        const label = document.createElement('label');
                        label.setAttribute('for', option);
                        label.textContent = option;
            
                        // Append the input and label to the poll option div
                        pollOptionDiv.appendChild(input);
                        pollOptionDiv.appendChild(label);
            
                        // Append the poll option div to the poll options container
                        pollOptionsContainer.appendChild(pollOptionDiv);
            
                        // Add event listener to toggle class on click
                        pollOptionDiv.addEventListener('click', function() {
                            // Remove 'selected' class from all options
                            const allOptions = document.querySelectorAll('.poll-option');
                            allOptions.forEach(option => {
                                option.classList.remove('selected');
                            });
            
                            // Add 'selected' class to clicked option
                            this.classList.add('selected');
                        });
                    });
                } else {
                    console.error('Error fetching poll options:', data.message);
                }
            })                             
            .catch(error => {
                console.error('Error fetching poll options:', error);
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
                    fetchCurrentEvent(); // Fetch the updated current event
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
