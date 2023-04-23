// file imports 
import './css/styles.css';
import '@splidejs/splide/css';
import apiCalls from '../src/apiCalls';
import User from '../src/User';

// image imports 
import './images/out-there-logo.png';
import './images/profile-icon.png';
import './images/pin-icon.png';
import './images/1.png';
import './images/2.png';
import './images/3.png';
import './images/4.png';
import './images/5.png';
import './images/departure-icon.png';
import './images/length-icon.png';
import './images/party-icon.png';
import './images/pending-icon.png';
import './images/confirmed-icon.png';
import './images/luggage-icon.png';
import './images/footer-logo.png';

// global variables
let travelersAPI, tripsAPI, destinationsAPI, user, trip, destination, selectedDestinationID;
let destinationsToggle = false;

// query selectors
const bookButton = document.querySelector(".book-button-landing");
const postButton = document.querySelector(".book-button-booking");
const dateInput = document.querySelector(".date-input");
const durationInput = document.querySelector(".duration-input");
const travelersInput = document.querySelector(".travelers-input");
const destinationsCarousel = document.querySelector(".splide__list");
const approvedImage = document.querySelector(".approved-image");
const pendingImage = document.querySelector(".pending-image");
const approvedDestination = document.querySelector(".approved-trip-destination");
const pendingDestination = document.querySelector(".pending-trip-destination");
const approvedDate = document.querySelector(".approved-trip-date");
const pendingDate = document.querySelector(".pending-trip-date");
const approvedDuration = document.querySelector(".approved-trip-duration");
const pendingDuration = document.querySelector(".pending-trip-duration");
const approvedTravelers = document.querySelector(".approved-trip-travelers");
const pendingTravelers = document.querySelector(".pending-trip-travelers");
const approvedID = document.querySelector(".approved-trip-id");
const pendingID = document.querySelector(".pending-trip-id");
const approvedCost = document.querySelector(".approved-trip-cost");
const pendingCost = document.querySelector(".pending-trip-cost");
const pendingDetails = document.querySelector(".pending-details-container");
const welcome = document.querySelector(".welcome");
const approvedSum = document.querySelector(".approved-sum");
const pendingSum = document.querySelector(".pending-sum");
const spentSum = document.querySelector(".spent-sum");
const selectedDestination = document.querySelector(".selected-destination");

// event listeners
postButton.addEventListener("click", postTrip);
destinationsCarousel.addEventListener("dblclick", selectDestination);

// functions
window.addEventListener('load', () => {
  Promise.all(apiCalls).then((callsArray) => {
      travelersAPI = callsArray[0].travelers;
      destinationsAPI = callsArray[1].destinations;
      tripsAPI = callsArray[2].trips;
      getRandomIndex();
      getUser();
      loadDestinationsCarousel();
      getPendingCarousel();
      getConfirmedCarousel();
      getTripCost();
      selectDestination();
    })
    .catch(error => console.log(error));
})

function getRandomIndex() {
  return Math.floor(Math.random() * travelersAPI.length);
}

function dateHelper(date) {
  let mm = date.slice(5,7);
  let dd = date.slice(8,10)
  let yyyy = date.slice(0, 4);
  let formattedDate = `${mm}/${dd}/${yyyy}`;
  return formattedDate;
}

function getUser() {
  user = new User(travelersAPI[getRandomIndex(travelersAPI)]);
  welcome.innerText = `Welcome back, ${user.name.split(" ")[0]}!`;
  approvedSum.innerText = `${user.getApproved(tripsAPI).length} Trips Approved`;
  pendingSum.innerText = `${user.getPending(tripsAPI).length} Trips Pending`;
  spentSum.innerText = `${user.getTotalSpent(tripsAPI, destinationsAPI)} Spent`;
}

function loadDestinationsCarousel()  {
    const loadCarousel = destinationsAPI.forEach((cv) =>  {
      let destinationName = cv.destination.split(",")[0];
      let destinationImage = cv.image;
      console.log(cv.id);
      // console.log(destinationImage);
      console.log(destinationName);
      let newSlide = `
      <div class="splide__slide" id="${cv.id}">
        <img class="destinationImage" id="${cv.id}" src="${destinationImage}">
        <p class="destinationName" id="${cv.id}" inert="true">${destinationName}</p>
      </div>
      `
      destinationsCarousel.innerHTML += newSlide;
    })
    new Splide( '.splide', {
      type: "loop",
      gap: 10,
      perPage: 5,
      pagination: false
    }).mount();
}

function getPendingCarousel() {
  let pendingTrips = user.getPending(tripsAPI, destinationsAPI);
  if (pendingTrips.length === 0)  {
    pendingDetails.innerHTML = `
    <p>You have no pending trips at this time.</p>
    `
  } else {
    const loadCarousel = pendingTrips.forEach((cv) =>  {
      trip = new Trip(cv.id, tripsAPI, destinationsAPI);
      let destinationName = destinationsAPI[cv.destinationID - 1].destination;
      let startDate = dateHelper(cv.date);
      let tripCost = trip.getTripCost(cv.id, tripsAPI, destinationsAPI);
      pendingDestination.innerHTML = `${destinationName}`;
      pendingDate.innerHTML = `Depature on ${startDate}`;
      pendingDuration.innerHTML = `${cv.duration} Days`;
      pendingTravelers.innerHTML = `${cv.travelers} Travelers`;
      pendingID.innerHTML = `Trip ID #${cv.id}`
      pendingCost.innerHTML = `${tripCost}`;
    })
  }
}

function getConfirmedCarousel() {
  let approvedTrips = user.getApproved(tripsAPI, destinationsAPI);
  const loadCarousel = approvedTrips.forEach((cv) =>  {
    trip = new Trip(cv.id, tripsAPI, destinationsAPI);
    let destinationName = destinationsAPI[cv.destinationID - 1].destination;
    let destinationImageSRC = destinationsAPI[cv.destinationID - 1].image;
    // console.log(destinationImageSRC);
    let startDate = dateHelper(cv.date);
    // approvedImage.src="${destinationImage}"
    // console.log(approvedImage);
    // console.log(cv);
    let tripCost = trip.getTripCost(cv.id, tripsAPI, destinationsAPI);
    approvedDestination.innerHTML = `${destinationName}`;
    approvedDate.innerHTML = `Departure on ${startDate}`;
    approvedDuration.innerHTML = `${cv.duration} Days`;
    approvedTravelers.innerHTML = `${cv.travelers} Travelers`;
    approvedID.innerHTML = `Trip ID #${cv.id}`;
    approvedCost.innerHTML = `${tripCost}`;
  //   let newSlide = `
  //     <div class="splide__slide" id="${cv.id}">
  //       <img class="destinationImage" src="${destinationImage}"
  //       <p class="destinationName">${destinationName}</p>
  //     </div>
  //     `
  //     destinationsCarousel.innerHTML += newSlide;
  //   })
  //   new Splide( '.splide', {
  //     type: "loop",
  //     gap: 10,
  //     perPage: 5,
  //     pagination: false
  //   }).mount();
  })
}

function selectDestination() {
  if (event.target.className.includes("destinationImage"))  {
    if (destinationsToggle === false) {
      selectedDestinationID = event.target.id;
      destinationsToggle = true;
      event.target.style.border = "3px solid #4F8FFD";
      event.target.style.filter = "grayscale(0)";
      let destinationIndex = [JSON.parse(selectedDestinationID) - 1];
      console.log(destinationsAPI[destinationIndex].destination);
      selectedDestination.innerText = `${destinationsAPI[destinationIndex].destination}`;
    } else if (destinationsToggle === true)  {
      selectedDestinationID = "";
      destinationsToggle = false;
      event.target.style.border = "0px solid #4F8FFD";
      event.target.style.filter = "grayscale(110)";
    }
  }
}

function postTrip() {
  // console.log(dateHelper(dateInput.value));
  // console.log(durationInput.value);
  // console.log(travelersInput.value);
  if (!dateInput.value || !durationInput.value || !travelersInput.value || selectedDestinationID === "") {
    window.alert("Whoa, hold up! We're missing something. Please select a destination, date of departure, duration of your trip, and number of travelers in your party.");
  } else if (destinationsToggle === false) {
  window.alert("You didn't tell us where you're going! Double-click your desintation to select it.");
  } else if (durationInput.value < 1)  {
    window.alert("Hmmm, something's wrong here. Your trip duration must be a minimum of 1 day.");
  } else if (travelersInput.value < 1)  {
    window.alert("Hmmm, something's wrong here. You must book tickets for a minimum of 1 traveler.");
  } else  {
  //   fetch('http://localhost:3001/api/v1/activity', {
  //     method: 'POST',
  //     body: JSON.stringify({userID: parseInt(`${user.id}`), date: `${userInputDate.value}`, flightsOfStairs: 0, minutesActive: 0, numSteps: `${userInputSteps.value}`}),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //     .then(postVerification.innerText = `You logged ${userInputSteps.value} steps on ${userInputDate.value}. Great Job!`)
  //     .then(postVerification.style.visibility = "visible")
  //     .then(response => response.json())
  //     .then(json => console.log(json))
  //     .catch(Error => window.alert('Server Error...Try Again later!'), Error);
  //     userInputDate.value = ''
  //     userInputSteps.value = ''
  //   }
    // console.log("wip");
    // console.log(selectedDestinationID);
  }
}