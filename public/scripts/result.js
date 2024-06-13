document.addEventListener('DOMContentLoaded', async function() {
  const event = localStorage.getItem('currentEvent');
  if (event) {
      document.getElementById('currentEvent').textContent = `${event}`;
      try {
          const response = await fetch(`/votes/${event}`);
          const data = await response.json();
          
          if (data.success) {
              const votes = data.options.map(option => option.votes);
              updateChart(votes);
          } else {
              console.error('Failed to fetch votes:', data.message);
          }
      } catch (error) {
          console.error('Error fetching votes:', error);
      }
  } else {
      window.location.href = 'index.html';
  }
});

const ctx = document.getElementById('results');

const chart = new Chart(ctx, {
type: 'bar',
data: {
  labels: ['Blaxland', 'Burgmann', 'Eddison', 'Edwards', 'Garnsey', 'Garran', 'Hay', 'Jones', 'Sheaffe', 'Middleton'],
  datasets: [{
    label: '',
    data: [],  // Initially empty, will be populated with votes
    backgroundColor: [
      'rgba(230, 60, 45, 0.8)',
      'rgba(252, 204, 0, 0.9)',
      'rgba(33, 59, 94, 0.9)',
      'rgba(136, 36, 38, 0.9)',
      'rgba(60, 155, 209, 0.9)',
      'rgba(92, 57, 111, 0.9)',
      'rgba(13, 8, 2, 0.9)',
      'rgba(26, 86, 48, 0.9)',
      'rgba(167, 166, 164, 0.9)',
      'rgba(29, 182, 120, 0.9)'
    ],
    borderColor: [
      'rgba(184, 48, 36, 1)',
      'rgba(202, 163, 0, 1)',
      'rgba(26, 47, 75, 1)',
      'rgba(109, 29, 30, 1)',
      'rgba(48, 124, 167, 1)',
      'rgba(74, 46, 89, 1)',
      'rgba(10, 6, 2, 1)',
      'rgba(20, 68, 38, 1)',
      'rgba(134, 133, 131, 1)',
      'rgba(23, 145, 96, 1)'
    ],
    borderWidth: 1,
    borderRadius: 5
  }]
},
options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
      legend: {
        display: false,
      }
  },
  scales: {
    y: {
      beginAtZero: true
    },
  }
}
});

function updateChart(votes) {
  chart.data.datasets[0].data = votes;
  chart.update();
}
