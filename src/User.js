class User {
  constructor(travelerObject) {
    this.userID = travelerObject.id;
    this.name = travelerObject.name;
    this.username = `traveler${travelerObject.id}`
    this.password = "travel";
  }

  getApproved(tripsAPI) {
    const reduceTrips = tripsAPI.reduce((acc, cv) =>  {
      if (cv.userID === this.userID && cv.status === "approved") {
        acc.push(cv);
      }
      return acc;
    }, [])
    return reduceTrips;
  }

  getPending(tripsAPI)  {
    const reduceTrips = tripsAPI.reduce((acc, cv) =>  {
      if (cv.userID === this.userID && cv.status === "pending") {
        acc.push(cv);
      }
      return acc;
    }, [])
    return reduceTrips;
  }

  getTotalSpent(tripsAPI, destinationsAPI) {
    const reduceTrips = tripsAPI.reduce((acc, cv) =>  {
      if (cv.userID === this.userID)  {
        let destinationID = (cv.destinationID - 1)
        let costLodging = (cv.travelers * destinationsAPI[destinationID].estimatedLodgingCostPerDay) * cv.duration;
        let costFlight = (cv.travelers * destinationsAPI[destinationID].estimatedFlightCostPerPerson);
        let price = ((costLodging + costFlight) + ((costLodging + costFlight) * 0.10));
        acc = acc + price;
      }
      return acc;
    }, 0)
    let unformatted = reduceTrips;
    let formatted = `$${unformatted.toLocaleString("en-US")}`;
    return formatted;
  }
};


export default User;