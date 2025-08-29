import { InitializeAvatarOptions } from "../../../utils/user.avatar.function.js";
import { RestaurantReservation } from "../../models/restaurant.reservation.model.js";
import { RestaurantReservationService } from "../../services/restaurant.reservation.service.js";

const restaurantReservationService = new RestaurantReservationService();

function showConfirmationModal(message: string): Promise<boolean> {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmModal') as HTMLDivElement;
        const modalMessage = document.getElementById('modal-message') as HTMLParagraphElement;
        const confirmYes = document.getElementById('confirmYes') as HTMLButtonElement;
        const confirmNo = document.getElementById('confirmNo') as HTMLButtonElement;

        modalMessage.textContent = message;
        modal.style.display = 'block';

        const cleanup = () => {
            modal.style.display = 'none';
            confirmYes.onclick = null;
            confirmNo.onclick = null;
        };

        confirmYes.onclick = () => {
            cleanup();
            resolve(true);
        };

        confirmNo.onclick = () => {
            cleanup();
            resolve(false);
        };
    });
}


function renderTouristReservations(): void {
    const reservationCardContainer = document.querySelector('#reservation-card-container') as HTMLDivElement;
    reservationCardContainer.innerHTML = '';

    const touristId = parseInt(localStorage.getItem('id'));
    restaurantReservationService.getAllByTouristId(touristId)
        .then((reservations: RestaurantReservation[]) => {
            reservations.forEach((reservation: RestaurantReservation) => {
                const reservationCard = document.createElement('div');
                reservationCard.classList.add("reservation-card");

                //PICTURE SECTION
                const restaurantPictureSection = document.createElement('div');
                restaurantPictureSection.classList.add('restaurant-picture-container');
                const restaurantPicture = document.createElement('img');
                restaurantPicture.src = reservation.restaurant.imageUrl;
                restaurantPicture.alt = "Restaurant picture";
                restaurantPictureSection.appendChild(restaurantPicture);
                reservationCard.appendChild(restaurantPictureSection);

                //RESERVATION DATA SECTION
                const reservationDataSection = document.createElement('div');
                reservationDataSection.classList.add('reservation-data-container');

                const restaurantName = document.createElement('h2');
                restaurantName.classList.add('restaurant-name')
                restaurantName.textContent = reservation.restaurant.name;
                reservationDataSection.appendChild(restaurantName);

                const reservationDateLabel = document.createElement('label');
                reservationDateLabel.textContent = "Reservation date:";
                reservationDataSection.appendChild(reservationDateLabel)

                const reservationDate = document.createElement('p');
                const dateElements = ((new Date(reservation.reservationDate)).toISOString()).split('T')
                const date = dateElements[0]
                const time = dateElements[1].slice(0, 5)
                reservationDate.textContent = `${date} ${time}h`;
                reservationDataSection.appendChild(reservationDate)

                const reservationMealLabel = document.createElement('label');
                reservationMealLabel.textContent = "Meal:";
                reservationDataSection.appendChild(reservationMealLabel)


                const reservationMeal = document.createElement('p');
                reservationMeal.textContent = reservation.mealType;
                reservationDataSection.appendChild(reservationMeal);

                const reservationNOGLabel = document.createElement('label');
                reservationNOGLabel.textContent = "Number of guests:";
                reservationDataSection.appendChild(reservationNOGLabel)

                const numberOfGuests = document.createElement('p');
                numberOfGuests.textContent = (reservation.numberOfGuests).toString();
                reservationDataSection.appendChild(numberOfGuests);

                const reviewStatusMessage = document.createElement('h4');
                reviewStatusMessage.classList.add('review-status-message');
                const status = getReviewStatusMessage(reservation);
                reviewStatusMessage.textContent = status.text;
                reviewStatusMessage.classList.add(status.className);

                //Review Tooltip
                const reviewstooltipWraper = document.createElement('div');
                reviewstooltipWraper.classList.add('tooltip-wrapper');

                const reviewsTooltipTextElement = document.createElement('span');
                reviewsTooltipTextElement.classList.add('tooltiptext')
                reviewsTooltipTextElement.textContent = "Reviews are not available right after booking. You can submit one starting 1 hour after your reservation, up to 72 hours later.";

                //BUTTON SECTION
                const buttonSection = document.createElement('div');
                buttonSection.classList.add('button-section');

                const reviewReservationBtn = document.createElement('button');
                reviewReservationBtn.classList.add('review-btn');
                reviewReservationBtn.textContent = "Review Restaurant";
                buttonSection.appendChild(reviewReservationBtn);
                validateReviewButtonState(reservation, reviewReservationBtn, reviewstooltipWraper);
                const reviewIntervalId = setInterval(() => {
                    validateReviewButtonState(reservation, reviewReservationBtn, reviewstooltipWraper)
                    const statusUpdate = getReviewStatusMessage(reservation);
                    reviewStatusMessage.textContent = statusUpdate.text;
                    reviewStatusMessage.classList.add(statusUpdate.className);
                    const now = new Date().getTime();
                    const reservationTime = new Date(reservation.reservationDate).getTime();
                    const timeFromReservation = (now - reservationTime) / (1000 * 60 * 60)

                    if (timeFromReservation >= 72 && timeFromReservation <= 1) {
                        clearInterval(reviewIntervalId);
                    }
                }, (1 * 60 * 1000));

                reviewReservationBtn.addEventListener('click', () => {
                    window.location.href = `../touristRestaurantReview/touristRestaurantReview.html?reservationId=${reservation.id}&restaurantId=${reservation.restaurantId}`;
                })

                reservationDataSection.appendChild(reviewStatusMessage);

                //Cancel Tooltip
                const tooltipWraper = document.createElement('div');
                tooltipWraper.classList.add('tooltip-wrapper');

                const tooltipTextElement = document.createElement('span');
                tooltipTextElement.classList.add('tooltiptext')
                tooltipTextElement.textContent = "Cancellation not allowed: Breakfast must be canceled at least 12 hours in advance, and lunch or dinner at least 4 hours in advance.";

                //Cancel button
                const cancelResrevationBtn = document.createElement('button');
                cancelResrevationBtn.textContent = "Cancel Reservation";
                cancelResrevationBtn.id = "cancelBtn";
                validateCancelButtonState(reservation, cancelResrevationBtn)
                const cancelIntervalId = setInterval(() => {
                    validateCancelButtonState(reservation, cancelResrevationBtn)
                    const now = new Date().getTime();
                    const reservationTime = new Date(reservation.reservationDate).getTime();
                    const remainingTime = reservationTime - now

                    const interval = reservation.mealType === "breakfast"
                        ? 12 * 60 * 60 * 1000
                        : 4 * 60 * 60 * 1000;
                    if (remainingTime < interval) {
                        clearInterval(cancelIntervalId);
                    }
                }, (1 * 60 * 1000));

                cancelResrevationBtn.onclick = async function () {
                    const confirm = await showConfirmationModal(`Do you really want to cancel your ${reservation.mealType} reservation at "${reservation.restaurant.name}" on ${new Date(reservation.reservationDate).toLocaleString()}?`);

                    if (!confirm) return;
                    restaurantReservationService.deleteReservation(reservation.id)
                        .then(() => {
                            renderTouristReservations();
                        })
                }

                reviewstooltipWraper.appendChild(reviewReservationBtn);
                reviewstooltipWraper.append(reviewsTooltipTextElement);
                buttonSection.appendChild(reviewstooltipWraper);

                tooltipWraper.appendChild(cancelResrevationBtn);
                tooltipWraper.append(tooltipTextElement);
                buttonSection.appendChild(tooltipWraper);

                reservationDataSection.appendChild(buttonSection);
                reservationCard.appendChild(reservationDataSection);

                reservationCardContainer.appendChild(reservationCard);
            });
        })

}

function getReviewStatusMessage(reservation: RestaurantReservation): { text: string, className: string } {
    const now = new Date().getTime();
    const reservationTime = new Date(reservation.reservationDate).getTime();
    const timeFromReservation = (now - reservationTime) / (1000 * 60 * 60);

    if (reservation.review) {
        return { text: `You rated this ${reservation.review.rating} stars`, className: "posted-review" };
    }

    if (timeFromReservation < 1) {
        return { text: `Reviews available starting 1 hour after your reservation at ${reservation.restaurant.name}.`, className: "vaiting-review" };
    } else if (timeFromReservation >= 1 && timeFromReservation <= 72) {
        return { text: `You have ${Math.floor(71-timeFromReservation)}h left to review your visit to ${reservation.restaurant.name}.`, className: "open-review" };
    } else {
        return { text: "Your reviewing time has passed.", className: "closed-review" };
    }
}

function validateCancelButtonState(reservation: RestaurantReservation, cancelResrevationBtn: HTMLButtonElement): void {
    if (reservation.mealType === "breakfast") {
        const twelveHours = 12 * 60 * 60 * 1000;
        const remainingTime = new Date(reservation.reservationDate).getTime() - new Date().getTime()
        if (remainingTime < twelveHours) {
            cancelResrevationBtn.disabled = true;
        } else {
            cancelResrevationBtn.disabled = false;
        }

    } else if (reservation.mealType === "lunch" || reservation.mealType === "dinner") {
        const fourHours = 4 * 60 * 60 * 1000;
        const remainingTime = new Date(reservation.reservationDate).getTime() - new Date().getTime()
        if (remainingTime < fourHours) {
            cancelResrevationBtn.disabled = true;
        } else {
            cancelResrevationBtn.disabled = false;
        }

    }

}

function validateReviewButtonState(reservation: RestaurantReservation, reviewReservationBtn: HTMLButtonElement, reviewstooltipWraper: HTMLDivElement): void {
    const now = new Date().getTime();
    const reservationTime = new Date(reservation.reservationDate).getTime();
    const timeFromReservation = (now - reservationTime) / (1000 * 60 * 60)

    if (reservation.review) {
        reviewstooltipWraper.style.visibility = "hidden";
        reviewReservationBtn.disabled = true;
    } else if (timeFromReservation >= 1 && timeFromReservation <= 72) {
        reviewReservationBtn.disabled = false;
    } else {
        reviewReservationBtn.disabled = true;
    }
}

InitializeAvatarOptions()
document.addEventListener('DOMContentLoaded', () => {
    renderTouristReservations();
})