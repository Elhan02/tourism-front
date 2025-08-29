import { InitializeAvatarOptions } from "../../../utils/user.avatar.function.js";
import { RestaurantReservation } from "../../models/restaurant.reservation.model.js";
import { RestaurantReviewFormData } from "../../models/restaurant.review.from.data.model.js";
import { RestaurantReservationService } from "../../services/restaurant.reservation.service.js";
import { RestaurantReviewService } from "../../services/restaurant.review.service.js";

const reservationService = new RestaurantReservationService();
const reviewService = new RestaurantReviewService();

let selectedRating = 0;
const stars = document.querySelectorAll('.star-rating span');
stars.forEach((star, index) => {
  star.addEventListener('mouseover', () => {
    stars.forEach((s, i) => {
      s.classList.toggle('hovered', i <= index);
    });
  });

  star.addEventListener('mouseout', () => {
    stars.forEach(s => s.classList.remove('hovered'));
  });

  star.addEventListener('click', () => {
    selectedRating = parseInt(star.getAttribute('data-value')!);
    stars.forEach((s, i) => {
      s.classList.toggle('active', i <= index);
    });
  });
});

RenderRestaurantSectionData();

InitializeAvatarOptions();

function RenderRestaurantSectionData() {
  const urlParams = new URLSearchParams(window.location.search);
  const reservationId = parseInt(urlParams.get("reservationId"));


  reservationService.getById(reservationId)
    .then((reservation: RestaurantReservation) => {
      const restaurantSection = document.querySelector('#restaurant-section') as HTMLDivElement;
      restaurantSection.style.backgroundImage = `url(${reservation.restaurant.imageUrl})`;

      const restaurantName = document.createElement('h2');
      restaurantName.id = "restaurant-name";
      restaurantName.textContent = reservation.restaurant.name;
      restaurantSection.appendChild(restaurantName);

      const reservationDate = document.createElement('p');
      reservationDate.id = "reservation-date";
      reservationDate.textContent = new Date(reservation.reservationDate).toDateString();
      restaurantSection.appendChild(reservationDate);

      const reservationMeal = document.createElement('p');
      reservationMeal.id = "reservation-meal";
      reservationMeal.textContent = reservation.mealType;
      restaurantSection.appendChild(reservationMeal);

    });
}

initializeSubmitBtn()
function initializeSubmitBtn(): void {
  const submitReviewBtn = document.querySelector('#submit-review') as HTMLButtonElement;
  submitReviewBtn.addEventListener('click', () => {
    submitReview()
  })
}

function submitReview(): void {
  const comment = (document.querySelector("#comment") as HTMLTextAreaElement).value;
  const rating = selectedRating;
  const dateOfReview = new Date();
  const touristId = parseInt(localStorage.getItem('id'));
  const urlParams = new URLSearchParams(window.location.search);
  const reservationId = parseInt(urlParams.get('reservationId'));
  const restaurantId = parseInt(urlParams.get('restaurantId'));

  const ratingErrorMessage = document.querySelector('#rating-error-message') as HTMLDivElement;

  let isValid = true;

  if (!rating || rating < 1) {
    ratingErrorMessage.style.display = "block"
    isValid = false;
  } else {
    ratingErrorMessage.style.display = "none";
  }

  if (!isValid) {
    return;
  }

  const messageBox = document.querySelector('#review-message') as HTMLDivElement;
  const submitReviewBtn = document.querySelector("#submit-review") as HTMLButtonElement;
  const reviewInputFrom = document.querySelector('#review-form') as HTMLFormElement;

  const reqBody: RestaurantReviewFormData = { rating, comment, dateOfReview, touristId, reservationId }

  messageBox.textContent = "Vaša recenzija se kreira...";
  messageBox.style.color = "blue";
  submitReviewBtn.disabled = true;
  setTimeout(() => {
    reviewService.create(restaurantId, reqBody)
      .then(() => {
        messageBox.textContent = "Recenzija je uspešno kreirana ✅";
        messageBox.style.color = "green";
        setTimeout(() => {
          window.location.href = "../touristRestaurantReservation/touristRestaurantReservation.html";
        }, 2000)
      })
      .catch((error) => {
        messageBox.textContent = "Došlo je do greške pri kreiranju recenzije ❌";
        messageBox.style.color = "red";
        console.error(error);
        setTimeout(() => {
          reviewInputFrom.reset();
          messageBox.textContent = "";
          const stars = document.querySelectorAll('.star-rating span');
          stars.forEach(s => s.classList.remove('active'));
          submitReviewBtn.disabled = false;
        }, 2000)
      })
  }, 2000)
}

document.addEventListener('DOMContentLoaded', initializeSubmitBtn)
