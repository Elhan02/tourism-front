import { Keypoint } from "../../model/keyPoint.model.js";
import { Tour } from "../../model/tour.model.js";
import { TourService } from "../../service/tour.service.js";

const tourService = new TourService();

function Initialize(): void {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = parseInt(urlParams.get("id"));
  let tourData: Tour = null;
  tourService.getById(id).then((tour: Tour) => {
    tourData = tour;
    InitializeAvatarOptions();
    RenderDetails(tourData);
  })
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

function RenderDetails(tourData: Tour): void {
  DisplayTourDetails(tourData);
  DisplayKeyPointDetails(tourData.keyPoints);
  InitializeModalForm(tourData);
}

function DisplayTourDetails(tourData: Tour): void {

  const tourHeader = document.querySelector('.tour-header');
  const tourName = document.createElement('h1');
  tourName.textContent = tourData.name;
  tourHeader.appendChild(tourName);

  const startAndMaxDiv = document.querySelector('.startTime-maxGuests');

  const startText = document.createElement('h3');
  startText.innerHTML = `<i class="fa-solid fa-clock"></i>  ${new Date(tourData.dateTime).toLocaleString("sv-SE")}`;
  startAndMaxDiv.appendChild(startText);

  const maxGuestsText = document.createElement('h3');
  maxGuestsText.innerHTML = `<i class="fa-solid fa-person"></i>  ${tourData.maxGuests.toString()}`;
  startAndMaxDiv.appendChild(maxGuestsText);
  tourHeader.appendChild(startAndMaxDiv);

  const tourDescription = document.querySelector('.tour-description');
  const descriptionText = document.createElement('p');
  descriptionText.textContent = tourData.description;
  tourDescription.appendChild(descriptionText);

  const bookBtn = document.querySelector('#bookBtn') as HTMLButtonElement;
  bookBtn.onclick = () => {
    window.location.href = "";
  }
}

function DisplayKeyPointDetails(keyPoints: Keypoint[]): void {
  const keyPointsDiv = document.querySelector('.keypoint-details');
  for (const keypoint of keyPoints) {
    const card = document.createElement('div');
    card.className = 'keypoint-card';
    
    const image = document.createElement('img') as HTMLImageElement;
    image.src = keypoint.imageUrl;
    card.appendChild(image);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'keypoint-desc-container';

    const name = document.createElement('h3');
    name.textContent = keypoint.name;
    descriptionDiv.appendChild(name);

    const description = document.createElement('p');
    description.textContent = keypoint.description;
    descriptionDiv.appendChild(description);
    card.appendChild(descriptionDiv);

    keyPointsDiv.appendChild(card);
  }
}

function InitializeModalForm(tour: Tour): void {
  const modal = document.getElementById("bookingModal");
  const bookNowBtn = document.getElementById("bookBtn") as HTMLButtonElement;
  const confirmBook = document.getElementById("bookTourBtn") as HTMLButtonElement;
  const span = document.querySelector(".close");
  const input = document.getElementById('guests') as HTMLInputElement;
  const inputError = document.getElementById('guestsInputError');
  const resultMessage = document.querySelector('.resultMessage') as HTMLDivElement;
  resultMessage.classList.add('hidden');

  const userId = parseInt(localStorage.getItem("id"));  
  let guestsCount = 0;

  bookNowBtn.onclick = function() {
    modal.style.display = "block";
  }

  input.addEventListener('blur', () => {
    guestsCount = parseInt(input.value);
    if(guestsCount <= 0 || input.value.trim() == ''){
      confirmBook.disabled = true;
      inputError.className = '';
    } else {
      confirmBook.disabled = false;
      inputError.className = 'hidden';
    }
  })

  confirmBook.onclick = function() {
   tourService.createReservation(userId, guestsCount, tour.id)
   .then(result => {
    if(!result.id){
      resultMessage.innerHTML = '';
      resultMessage.innerHTML = result;
      resultMessage.style.backgroundColor = "#d9534f";
      resultMessage.classList.remove('hidden');
      setTimeout(() => {
        resultMessage.classList.add('hidden');
      }, 3000);
    } else {
      resultMessage.innerHTML = '';
      resultMessage.innerHTML = "You have successfully booked this tour. You can check reservations at 'My reservations' tab.";
      resultMessage.style.backgroundColor = "#7dd8a0";
      resultMessage.classList.remove('hidden');
      setTimeout(() => {
        resultMessage.classList.add('hidden');
      }, 3000);
      setTimeout(() => {
        modal.style.display = "none";
      }, 1000);
    }
   });
  }

  span.addEventListener('click', () => {
    modal.style.display = "none";
  })

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }

}


document.addEventListener('DOMContentLoaded', Initialize);