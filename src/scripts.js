// file imports 
import './css/styles.css';
import '@splidejs/splide/css';
import apiCalls from '../src/apiCalls';

// image imports 
import './images/out-there-logo.png';
import './images/profile-icon.png';
import './images/pin-icon.png';
import './images/1.png';
import './images/2.png';
import './images/3.png';
import './images/4.png';
import './images/5.png';
import './images/6.png';
import './images/7.png';
import './images/8.png';
import './images/9.png';
import './images/10.png';
import './images/departure-icon.png';
import './images/length-icon.png';
import './images/party-icon.png';
import './images/pending-icon.png';
import './images/confirmed-icon.png';
import './images/luggage-icon.png';
import './images/footer-logo.png';

// global variables

// event listeners

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