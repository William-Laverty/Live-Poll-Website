document.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('name');
    const username = localStorage.getItem('username'); // Assume username is stored in localStorage
    if (name && username) {
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
                    pollOptionsContainer.innerHTML = ''; 

                    fetchUserData(eventId, username)
                        .then(user => {
                            if (user && user[eventId] === true) {
                                const alreadyVotedMessage = document.createElement('div');
                                alreadyVotedMessage.textContent = `You have already voted for ${eventId}`;
                                alreadyVotedMessage.classList.add('already-voted');
                                pollOptionsContainer.appendChild(alreadyVotedMessage);
                            } else {
                                data.options.forEach((option, index) => {
                                    // Create a div for each poll option
                                    const pollOptionDiv = document.createElement('div');
                                    pollOptionDiv.classList.add('poll-option');

                                    // Create the radio input element
                                    const input = document.createElement('input');
                                    input.setAttribute('type', 'radio');
                                    input.setAttribute('name', 'pollOption');
                                    input.setAttribute('value', option);
                                    input.setAttribute('id', `radio${index + 1}`);

                                    // Create the label element
                                    const label = document.createElement('label');
                                    label.setAttribute('for', `radio${index + 1}`);
                                    label.textContent = option;

                                    // Append the input and label to the poll option div
                                    pollOptionDiv.appendChild(input);
                                    pollOptionDiv.appendChild(label);

                                    // Append the poll option div to the poll options container
                                    pollOptionsContainer.appendChild(pollOptionDiv);
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching user data:', error);
                        });
                } else {
                    console.error('Error fetching poll options:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching poll options:', error);
            });
    }

    function fetchUserData(eventId, username) {
        return fetch(`https://3.107.27.254:443/user/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(data => {
                if (data.success && data.user) {
                    return data.user;
                } else {
                    throw new Error('User data not found');
                }
            });
    }

    fetchCurrentEvent();

    // Event listener for submitting a vote
    document.getElementById('pollForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const selectedOption = document.querySelector('input[name="pollOption"]:checked');
        const currentEventId = localStorage.getItem('currentEvent');
        if (selectedOption) {
            const selectedOptionId = selectedOption.value;
            // Send a POST request to submit the vote
            fetch('https://3.107.27.254:443/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eventId: currentEventId,
                    optionId: selectedOptionId,
                    username: username
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to submit vote');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    window.location.href = '../html/submitted.html';
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error submitting vote:', error);
                alert('An error occurred while submitting your vote');
            });
        } else if (user && user[eventId] === true) {
            window.location.href = '../html/results.html';
        } else {
            alert('Please select an option to vote for');
        }
    });
});
