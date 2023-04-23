let apiCalls;

const travelersAPI = fetch("http://localhost:3001/api/v1/travelers")
  .then(response => response.json())
  .catch(error => console.log(error));

const destinationsAPI = fetch("http://localhost:3001/api/v1/destinations")
  .then(response => response.json())
  .catch(error => console.log(error));

  const tripsAPI = fetch("http://localhost:3001/api/v1/trips")
  .then(response => response.json())
  .catch(error => console.log(error));

apiCalls = [travelersAPI, destinationsAPI, tripsAPI];

export default apiCalls;
