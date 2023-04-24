let apiCalls;

const destinationsAPI = fetch("http://localhost:3001/api/v1/destinations")
  .then(response => response.json())
  .catch(error => console.log(error));

const tripsAPI = fetch("http://localhost:3001/api/v1/trips")
  .then(response => response.json())
  .catch(error => console.log(error));

apiCalls = [destinationsAPI, tripsAPI];

export default apiCalls;
