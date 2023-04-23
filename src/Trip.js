class Trip {
  constructor(tripID, userID, tripsAPI, destinationsAPI) {
    this.tripID = tripID;
    this.userID = userID;
  }

    // POST	{id: <number>, userID: <number>, destinationID: <number>, travelers: <number>, date: <string 'YYYY/MM/DD'>, duration: <number>, status: <string 'approved' or 'pending'>, suggestedActivities: <array of strings>}

  // destinationID(tripID, userID, destinationsAPI) {
  //   console.log(destinationsAPI)
  //   const findDestinationID = destinationsAPI.find((cv))
  //   return destinationID;
  // }

  cost(tripsID, userID, tripsAPI, destinationsAPI)  {
    let tripObject = tripsAPI[this.tripID];
    let destinationID = tripObject.destinationID;
    let destinationObject = destinationsAPI[destinationID - 1];
    let costLodging = (tripObject.travelers * destinationObject.estimatedLodgingCostPerDay) * tripObject.duration;
    let costFlight = (tripObject.travelers * destinationObject.estimatedFlightCostPerPerson);
    let unformatted = ((costLodging + costFlight) + ((costLodging + costFlight) * 0.10));
    let price = `$${unformatted.toLocaleString("en")}`;
    return price;
 }
}

export default Trip;