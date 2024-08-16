# Live Poll Website (Designed for CGS House Music Competition)

## Overview

HouseMusic Voting App is a web application that allows users to vote for their favorite songs in various events. The application uses MongoDB for data storage and Chart.js to display the voting results in a bar chart. This README provides a detailed overview of the setup, methods, and functionalities of the app.

## Table of Contents

1. [Setup](#setup)
2. [Server-side Implementation](#server-side-implementation)
3. [Client-side Implementation](#client-side-implementation)
4. [API Endpoints](#api-endpoints)
5. [Chart Update Mechanism](#chart-update-mechanism)

## Setup

### Prerequisites

- Node.js
- MongoDB Atlas account
- SSL Certificate and Private Key

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/housemusic-voting-app.git
    cd housemusic-voting-app
    ```
2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```sh
    MONGO_URI=mongodb+srv://<username>:<password>@housemusic.xtse8op.mongodb.net/?retryWrites=true&w=majority&appName=HouseMusic
    ```

4. Start the server:
    ```sh
    node server.js
    ```

## Server-side Implementation

The server-side code is implemented using Express.js and connects to a MongoDB Atlas cluster.

### Connecting to MongoDB

```js
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
  }
}
connectToMongoDB();
```

## API Endpoints

### 1. Get Current Event

**Endpoint:** `/current-event`  
**Method:** `GET`  
**Description:** Fetches the current event being voted on.  
**Response:**
```json
{
  "success": true,
  "currentEvent": "Rock"
}
```

### 2. Verify User

**Endpoint:** `/verify-user`  
**Method:** `POST`  
**Request Body:**
```json
{
  "username": "12345",
  "lastName": "Doe"
}
```
**Description:** Verifies if the user exists and if they are an admin.  
**Response:**
```json
{
  "success": true,
  "name": "John Doe",
  "isAdmin": false
}
```

### 3. Update Current Event

**Endpoint:** `/update-event`  
**Method:** `POST`  
**Request Body:**
```json
{
  "eventId": "Rock"
}
```
**Description:** Updates the current event being voted on.  
**Response:**
```json
{
  "success": true,
  "message": "Current event updated successfully"
}
```

### 4. Get Poll Options for Event

**Endpoint:** `/poll-options/:eventId`  
**Method:** `GET`  
**Description:** Fetches the poll options for the given event.  
**Response:**
```json
{
  "success": true,
  "options": [
    { "optionId": "Stairway to Heaven - Led Zeppelin", "votes": 2 },
    { "optionId": "Peer Gynt Suite No. 1 - Edvard Grieg", "votes": 4 }
  ]
}
```

### 5. Submit Vote

**Endpoint:** `/vote`  
**Method:** `POST`  
**Request Body:**
```json
{
  "eventId": "Rock",
  "optionId": "Stairway to Heaven - Led Zeppelin",
  "username": "12345"
}
```
**Description:** Submits a vote for a specific song in the current event.  
**Response:**
```json
{
  "success": true,
  "message": "Vote submitted successfully"
}
```

## Client-side Implementation

The client-side code is responsible for fetching data from the server and updating the Chart.js graph.

### Fetch and Update Votes

**File:** `result.js`

```js
document.addEventListener('DOMContentLoaded', async function() {
  const event = localStorage.getItem('currentEvent');
  if (event) {
    document.getElementById('currentEvent').textContent = `${event}`;
    fetchAndUpdateVotes(event);

    // Update the chart data every 5 seconds
    setInterval(() => {
      fetchAndUpdateVotes(event);
    }, 5000);
  } else {
    window.location.href = 'index.html';
  }
});

async function fetchAndUpdateVotes(event) {
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
}

function updateChart(votes) {
  chart.data.datasets[0].data = votes;
  chart.update();
}
```

### Chart.js Configuration

**File:** `result.js`

```js
const ctx = document.getElementById('results');

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Blaxland', 'Burgmann', 'Eddison', 'Edwards', 'Garnsey', 'Garran', 'Hay', 'Jones', 'Sheaffe', 'Middleton'],
    datasets: [{
      label: '',
      data: [],
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
```

## Chart Update Mechanism

The chart data is updated every 5 seconds by fetching the latest vote counts from the server and updating the chart accordingly. This is done using the `setInterval` function in the `DOMContentLoaded` event handler.

### Function fetchAndUpdateVotes

This function fetches the latest vote data for the current event from the server and updates the chart.

### Function updateChart

This function updates the chart with the new vote data.

```js
function updateChart(votes) {
  chart.data.datasets[0].data = votes;
  chart.update();
}
```
