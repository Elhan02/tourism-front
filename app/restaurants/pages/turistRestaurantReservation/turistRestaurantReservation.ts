import { InitializeAvatarOptions } from "../../../utils/user.avatar.function.js";
import { RestaurantReservation } from "../../models/restaurant.reservation.js";
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
    const reservationTable = document.querySelector('tbody') as HTMLTableSectionElement;
    reservationTable.innerHTML = '';

    const touristId = parseInt(localStorage.getItem('id'));
    restaurantReservationService.getAllByTouristId(touristId)
        .then((reservations: RestaurantReservation[]) => {
            reservations.forEach((reservation: RestaurantReservation) => {
                const tableRow = document.createElement('tr') as HTMLTableRowElement;

                const restaurantName = document.createElement('td') as HTMLTableCellElement;
                restaurantName.textContent = reservation.restaurant.name;
                tableRow.appendChild(restaurantName);

                const reservationDate = document.createElement('td');
                reservationDate.textContent = (new Date(reservation.reservationDate)).toDateString();
                tableRow.appendChild(reservationDate)

                const reservationMeal = document.createElement('td') as HTMLTableCellElement;
                reservationMeal.textContent = reservation.mealType;
                tableRow.appendChild(reservationMeal);

                const numberOfGuests = document.createElement('td') as HTMLTableCellElement;
                numberOfGuests.textContent = (reservation.numberOfGuests).toString();
                tableRow.appendChild(numberOfGuests);

                const tooltipWraper = document.createElement('div') as HTMLDivElement;
                tooltipWraper.classList.add('tooltip-wrapper');

                const tooltipTextElement = document.createElement('span') as HTMLSpanElement;
                tooltipTextElement.classList.add('tooltiptext')
                tooltipTextElement.textContent = "Cancellation not allowed: Breakfast must be canceled at least 12 hours in advance, and lunch or dinner at least 4 hours in advance.";

                const cancelResrevationBtnCell = document.createElement('td') as HTMLTableCellElement;
                const cancelResrevationBtn = document.createElement('button') as HTMLButtonElement;
                cancelResrevationBtn.textContent = "Cancel Reservation";
                cancelResrevationBtn.id = "cancelBtn";
                validateCancelButtonState(reservation, cancelResrevationBtn)

                cancelResrevationBtn.onclick = async function () {
                    const confirm = await showConfirmationModal(`Do you really want to cancel your ${reservation.mealType} reservation at "${reservation.restaurant.name}" on ${new Date(reservation.reservationDate).toLocaleString()}?`);
    
                    if (!confirm) return;
                    restaurantReservationService.deleteReservation(reservation.id)
                    .then(()=>{
                        renderTouristReservations();
                    })
                    
                }

                cancelResrevationBtnCell.appendChild(tooltipWraper);
                tooltipWraper.appendChild(cancelResrevationBtn);
                tooltipWraper.append(tooltipTextElement);
                tableRow.appendChild( cancelResrevationBtnCell);


                reservationTable.appendChild(tableRow);

            });
        })

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

InitializeAvatarOptions()
document.addEventListener('DOMContentLoaded', renderTouristReservations)