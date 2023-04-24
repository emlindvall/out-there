// file imports 
import './css/styles.css';
import '@splidejs/splide/css';
import apiCalls from '../src/apiCalls';
import User from '../src/User';
import Trip from '../src/Trip';

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
let travelersAPI, tripsAPI, destinationsAPI, user, trip, selectedDestinationID;
let signedIn = false;
let destinationsToggle = false;

// query selectors
const dropdownButton = document.querySelector(".dropdown-button");
const optionMenu = document.querySelector(".sign-in-container");
const username = document.getElementById("username");
const password = document.getElementById("password");
const submitButton = document.querySelector(".submit-button");
const bookButton = document.querySelector(".book-button-landing");
const postButton = document.querySelector(".book-button-booking");
const dateInput = document.getElementById("date");
const durationInput = document.getElementById("duration");
const travelersInput = document.getElementById("travelers");
const locationInput = document.getElementById("location");
const destinationsCarousel = document.getElementById("destination-splide__list");
const approvedCarousel = document.getElementById("approved-splide__list");
const pendingCarousel = document.getElementById("pending-splide__list");
const pendingDetails = document.querySelector(".pending-details-container");
const welcome = document.querySelector(".welcome");
const approvedSum = document.querySelector(".approved-sum");
const pendingSum = document.querySelector(".pending-sum");
const spentSum = document.querySelector(".spent-sum");
const selectedDestination = document.querySelector(".selected-destination");
const costEstimate = document.querySelector(".cost-estimate");
const formFields = document.getElementsByClassName("form-field");

// event listeners
dropdownButton.addEventListener("click", () =>
  optionMenu.classList.toggle("active")
);
submitButton.addEventListener("click", signIn);
destinationsCarousel.addEventListener("dblclick", selectDestination);
postButton.addEventListener("click", postTrip);

// functions
window.addEventListener('load', () => {
  Promise.all(apiCalls).then((cv) => {
      travelersAPI = cv[0].travelers;
      destinationsAPI = cv[1].destinations;
      tripsAPI = cv[2].trips;
      getRandomIndex();
      getUser();
      loadDestinationsCarousel();
      getApprovedCarousel();
      getPendingCarousel();
      selectDestination();
      mountSplides();
    })
    .catch(error => console.log(error));
})

function getRandomIndex() {
  return Math.floor(Math.random() * travelersAPI.length);
}

function getUser() {
  user = new User(travelersAPI[getRandomIndex(travelersAPI)]);
  welcome.innerText = `Welcome back, ${user.name.split(" ")[0]}!`;
  approvedSum.innerText = `${user.getApproved(tripsAPI).length} Trips Approved`;
  pendingSum.innerText = `${user.getPending(tripsAPI).length} Trips Pending`;
  spentSum.innerText = `${user.getTotalSpent(tripsAPI, destinationsAPI)} Spent`;
}

function signIn() {
  let maxTravelers = travelersAPI.length;
  let userID = username.value.slice(8,10);
  if (username.value && password.value && password.value === "travel" && username.value.includes("traveler") && userID <= 50) {
    console.log(username.value);
    console.log(password.value);
  } if (!username.value || !password.value) {
    window.alert("Whoa, hold up! Please make sure to enter both a username and a password.");
  }
  let user = new User(travelersAPI[userID - 1])
  console.log(user);
  username.value = "";
  password.value = "";
  optionMenu.classList.toggle("active")
}

function dateHelperDOM(date) {
  let mm = date.slice(5,7);
  let dd = date.slice(8,10)
  let yyyy = date.slice(0, 4);
  let formattedDate = `${mm}/${dd}/${yyyy}`;
  return formattedDate;
}

function dateHelperPost(date) {
  let mm = date.slice(5,7);
  let dd = date.slice(8,10)
  let yyyy = date.slice(0, 4);
  let formattedDate = `${yyyy}/${mm}/${dd}`;
  return formattedDate;
}

function getCostEstimate()  {
  let duration = durationInput.value;
  let travelers = travelersInput.value;
  let costLodging = ((destinationsAPI[selectedDestinationID - 1].estimatedLodgingCostPerDay) * travelers) * duration;
  let costFlight = (destinationsAPI[selectedDestinationID - 1].estimatedFlightCostPerPerson) * travelers;
  let unformatted = ((costLodging + costFlight) + ((costLodging + costFlight) * 0.10));
  let price = `$${unformatted.toLocaleString("en")}`;
  return price;
}

function displayCostEstimate()  {
  let inputCounter = 0;
  if (formFields.length > 0)  {
    const checkForInput = Array.from(formFields).forEach((cv) => {
      if (cv.value) {
        inputCounter = (inputCounter + 1);
      }
      if (inputCounter === 4) {
        costEstimate.style.display = "inline";
        costEstimate.innerText = `The estimated overall cost for this trip is ${getCostEstimate()}`;
      }
    })
  }
}

function loadDestinationsCarousel()  {
    const loadCarousel = destinationsAPI.forEach((cv) =>  {
      let destinationName = cv.destination.split(",")[0];
      let destinationImage = cv.image;
      let newSlide = `
      <div class="splide__slide" id="destination-splide__slide">
        <img class="destinationImage" id="${cv.id}" alt="${destinationName} selector" src="${destinationImage}">
        <p class="carouselName" id="${cv.id}" inert="true">${destinationName}</p>
      </div>
      `
      destinationsCarousel.innerHTML += newSlide;
    })
    new Splide( '#destination-splide', {
      type: "loop",
      gap: 10,
      perPage: 5,
      pagination: true
    }).mount();
}

function getPendingCarousel() {
  let pendingTrips = user.getPending(tripsAPI);
  if (pendingTrips.length === 0)  {
    pendingDetails.innerHTML = `
    <p>You have no pending trips at this time.</p>
    `
  } else {
    const loadCarousel = pendingTrips.forEach((cv) =>  {
      trip = new Trip(cv.id, tripsAPI, destinationsAPI);
      let destinationName = destinationsAPI[cv.destinationID - 1].destination;
      let destinationImageSRC = destinationsAPI[cv.destinationID - 1].image;
      let startDate = dateHelperDOM(cv.date);
      let tripCost = trip.getTripCost(cv.id, tripsAPI, destinationsAPI);
      let newSlide = `
        <div class="splide__slide" id="pending-splide__slide">
          <img class="destinationImage" id="pending-destinationImage" alt="${destinationName} image" src="${destinationImageSRC}"
          <p class="destinationName" id="pending-destination-name">${destinationName}</p>
          <p class="pending-trip-date">Departure on ${startDate}</p>
          <p class="pending-trip-duration">${cv.duration} Days</p>
          <p class="pending-trip-travelers">${cv.travelers} Travelers</p>
          <p class="pending-trip-id">Trip ID #${cv.id}</p>
          <p class="pending-trip-cost">${tripCost}</p>
        </div>
      `
      pendingCarousel.innerHTML += newSlide;
    })
    new Splide( '#pending-splide', {
      type: "slide",
      perPage: 1,
      pagination: true
    }).mount();
  }
}

function getApprovedCarousel() {
  let approvedTrips = user.getApproved(tripsAPI, destinationsAPI);
  const loadCarousel = approvedTrips.forEach((cv) =>  {
    trip = new Trip(cv.id, tripsAPI, destinationsAPI);
    let destinationName = destinationsAPI[cv.destinationID - 1].destination;
    let destinationImageSRC = destinationsAPI[cv.destinationID - 1].image;
    let startDate = dateHelperDOM(cv.date);
    let tripCost = trip.getTripCost(cv.id, tripsAPI, destinationsAPI);
    let newSlide = `
      <div class="splide__slide" id="approved-splide__slide">
        <img class="destinationImage" id="approved-destinationImage" alt="${destinationName} image" src="${destinationImageSRC}"
        <p class="destinationName" id="approved-destination-name">${destinationName}</p>
        <p class="approved-trip-date">Departure on ${startDate}</p>
        <p class="approved-trip-duration">${cv.duration} Days</p>
        <p class="approved-trip-travelers">${cv.travelers} Travelers</p>
        <p class="approved-trip-id">Trip ID #${cv.id}</p>
        <p class="approved-trip-cost">${tripCost}</p>
      </div>
      `
      approvedCarousel.innerHTML += newSlide;
    })
    new Splide( '#approved-splide', {
      type: "slide",
      perPage: 1,
      pagination: true
    }).mount();
}

function selectDestination() {
  if (event.target.className.includes("destinationImage"))  {
    if (destinationsToggle === false) {
      selectedDestinationID = event.target.id;
      destinationsToggle = true;
      locationInput.value = selectedDestinationID;
      event.target.style.border = "3px solid #4F8FFD";
      event.target.style.filter = "grayscale(0)";
      let destinationIndex = [JSON.parse(selectedDestinationID) - 1];
      selectedDestination.innerText = `${destinationsAPI[destinationIndex].destination}`;
      displayCostEstimate();
    } else if (destinationsToggle === true)  {
      selectedDestinationID = "";
      destinationsToggle = false;
      event.target.style.border = "0px solid #4F8FFD";
      event.target.style.filter = "grayscale(110)";
    }
  }
}

function postTrip() {
  event.preventDefault();
  let date = dateInput.value;
  let tripDate = dateHelperPost(date);
  let tripDuration = durationInput.value;
  let tripTrav = travelersInput.value;
  let tripDest = Number(selectedDestinationID);
  let currentUser = user.userID;
  let tripStat = "pending";
  let idPlusOne = (tripsAPI.length + 1);
  if (!dateInput.value || !durationInput.value || !travelersInput.value || selectedDestinationID === "") {
    window.alert("Whoa, hold up! We're missing something. Please select a destination, date of departure, duration of your trip, and number of travelers in your party.");
  } else if (destinationsToggle === false) {
  window.alert("You didn't tell us where you're going! Double-click your desintation to select it.");
  } else if (durationInput.value < 1)  {
    window.alert("Hmmm, something's wrong here. Your trip duration must be a minimum of 1 day.");
  } else if (travelersInput.value < 1)  {
    window.alert("Hmmm, something's wrong here. You must book tickets for a minimum of 1 traveler.");
  } else  {
    fetch('http://localhost:3001/api/v1/trips', {
        method: 'POST',
        body: JSON.stringify(
            {id: idPlusOne , 
              userID: currentUser, 
              destinationID: tripDest, 
              travelers: tripTrav, 
              date: tripDate, 
              duration: tripDuration, 
              status: tripStat,
              suggestedActivities: [] }
              ),
              headers: {
                'Content-Type': 'application/json'
              }
        })
        .then(response => response.json())
        .then(fetchTripsAPI())
        .then(getPendingCarousel())
        .catch(Error => 'Server Error... Try again later!');
      }
    }


function fetchTripsAPI()  {
  let tripsPromise = fetch("http://localhost:3001/api/v1/trips")
    .then(response => response.json())
    .catch(error => console.log(error));
  Promise.resolve(tripsPromise).then(
    (value) => {
      console.log(value.trips)
      tripsAPI = value.trips
    },
    (reason) => {
    }
  );
  return tripsAPI;
}