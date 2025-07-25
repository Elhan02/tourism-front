
import { TourService } from "../../service/tour.service.js"
import { Reservation } from "../../model/reservation.model.js";

const tourService = new TourService();

function Initialize(): void {
    const userId: number = parseInt(localStorage.getItem('id'));
    tourService.getTouristReservations(userId)
    .then((reservations: Reservation[]) => {
        InitializeAvatarOptions();
        RenderTable(reservations);
    });
}

function InitializeAvatarOptions(): void {
    const avatarBtn = document.getElementById('avatarBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutElement = document.querySelector("#logoutBtn");
    const touristReservations = document.querySelector('#myReservations') as HTMLElement;
    const username = document.querySelector('.username') as HTMLElement;
    username.textContent = localStorage.getItem('username');

    if (localStorage.getItem('role').trim() != 'turista'){
      touristReservations.style.display = 'none';
    }

    avatarBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!avatarBtn.contains(target) && !dropdownMenu.contains(target)) {
            dropdownMenu.style.display = 'none';
        }
    });

    logoutElement.addEventListener("click", function (event) {
        event.stopPropagation();
        localStorage.removeItem("id");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
    });

}

function RenderTable(reservations: Reservation[]) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    reservations.forEach((reservation: Reservation) => {
        const tableRow = document.createElement('tr');

        const cell1 = document.createElement('td');
        cell1.textContent = reservation.tour.name;
        tableRow.appendChild(cell1)

        const cell2 = document.createElement('td');
        cell2.textContent = new Date(reservation.tour.dateTime).toLocaleString("sv-SE");
        tableRow.appendChild(cell2)

        const cell3 = document.createElement('td');
        cell3.textContent = reservation.guests.toString();
        tableRow.appendChild(cell3)

        const cell4 = document.createElement('td');

        const wrapper = document.createElement('div');
        wrapper.className = 'tooltip-wrapper';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel reservation';
        cancelBtn.id = 'delReservationBtn';
        cancelBtn.onclick = () => { cancelReservation(reservation.id) };

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-text';
        tooltip.textContent = 'Tour already started or starting in less than 24 hours.';

        wrapper.appendChild(cancelBtn);
        wrapper.appendChild(tooltip);
        cell4.appendChild(wrapper);
        tableRow.appendChild(cell4);

        tableBody.appendChild(tableRow);
        IsCancelAvailable(reservation, cancelBtn);
    });
    console.log(reservations);
}

function IsCancelAvailable(reservation: Reservation, cancelBtn: HTMLButtonElement): void {
    const dateTime = new Date(reservation.tour.dateTime);
    const timeDifference = dateTime.getTime() - Date.now();
    if (timeDifference < 0 || timeDifference < 24 * 60 * 60 * 1000) {
        cancelBtn.disabled = true;
    } else {
        cancelBtn.disabled = false;
    }
}

function cancelReservation(reservationId: number): void {
    tourService.cancelReservation(reservationId)
    .then( () => { Initialize() });
}

document.addEventListener('DOMContentLoaded', Initialize);