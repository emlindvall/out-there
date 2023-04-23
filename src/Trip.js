class Trip {
  constructor(tripID, tripsAPI, destinationsAPI) {
    this.tripID = tripID;

  }
  getTripCost(tripID, tripsAPI, destinationsAPI)  {
    let tripObject = tripsAPI[tripID - 1];
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