import { TourService } from "../../service/tour.service.js";

const tourService = new TourService();

function Initialize(): void {
  InitializeAvatarOptions();
  const addTourBtn = document.querySelector("#addTourBtn");
  addTourBtn.addEventListener("click", function () {
    window.location.href = "../toursForm/toursForm.html";
  });
  renderData();
}

function InitializeAvatarOptions(): void {
    const avatarBtn = document.getElementById('avatarBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutElement = document.querySelector("#logoutBtn");
    const username = document.querySelector('.username') as HTMLElement;
    username.textContent = localStorage.getItem('username');

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

function renderData(): void {
  const id = parseInt(localStorage.getItem("id")) as number;
  tourService.getAllByGuideId(id).then((tours) => {
    for (let i = 0; i < tours.length; i++) {
      const toursContainer = document.querySelector(".tours-container");

      const tourWrapper = document.createElement("div");
      tourWrapper.className = "tour-wrapper";

      const tourDesc = document.createElement("div");
      tourDesc.className = "tour-description";

      const tourCard = document.createElement("div");
      tourCard.classList.add("tour-card");

      const p1 = document.createElement("strong");
      p1.className = "tourName";
      //const strong1 = document.createElement("strong");
      //strong1.textContent = "Name: ";
      //p1.appendChild(strong1);
      p1.innerHTML += tours[i].name;
      tourCard.appendChild(p1);

      const p2 = document.createElement("p");
      //const strong2 = document.createElement("strong");
      //strong2.textContent = "Description: ";
      //p2.appendChild(strong2);
      p2.innerHTML += tours[i].description;

      const p3 = document.createElement("p");
      const strong3 = document.createElement("strong");
      strong3.textContent = "Departure date: ";
      p3.appendChild(strong3);
      p3.innerHTML += new Date(tours[i].dateTime).toLocaleString("sv-SE");
      tourCard.appendChild(p3);

      const p4 = document.createElement("p");
      const strong4 = document.createElement("strong");
      strong4.textContent = "Capacity: ";
      p4.appendChild(strong4);
      p4.innerHTML += tours[i].maxGuests;
      tourCard.appendChild(p4);

      const statusWrapper = document.createElement("div");
      statusWrapper.className = "status-wrapper";

      const settings = document.createElement("div");
      settings.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="settings-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                            </svg>`;
      settings.className = "settings-div";

      settings.addEventListener("click", (e) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const menu = target
          .closest(".tour-description")
          .querySelector(".settings-menu");
        menu.classList.toggle("active");
      });

      const p5 = document.createElement("p");
      p5.className = "tourStatus";
      const strong5 = document.createElement("strong");
      strong5.textContent = "Status: ";
      p5.appendChild(strong5);
      p5.innerHTML += tours[i].status;
      statusWrapper.appendChild(p5);
      statusWrapper.appendChild(settings);
      tourDesc.appendChild(statusWrapper);

      const buttonDiv = document.createElement("div");
      buttonDiv.id = "button-container";

      const editBtn = document.createElement("button");
      editBtn.innerHTML = `Edit`;
      editBtn.classList.add("button");
      editBtn.id = "editBtn";

      editBtn.onclick = function () {
        window.location.href = `../toursForm/toursForm.html?id=${tours[i].id}`;
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("button");
      deleteBtn.id = "deleteBtn";
      deleteBtn.onclick = function () {
        tourService.delete(tours[i].id);
        window.location.reload();
      };

      const settingsMenu = document.createElement("div");
      settingsMenu.className = "settings-menu";
      settingsMenu.appendChild(editBtn);
      settingsMenu.appendChild(deleteBtn);
      tourDesc.appendChild(settingsMenu);

      tourDesc.appendChild(p2);

      tourWrapper.appendChild(tourCard);
      tourWrapper.appendChild(tourDesc);
      toursContainer.appendChild(tourWrapper);
    }
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      document.querySelectorAll(".settings-menu").forEach((menu) => {
        if (
          !menu.contains(target) &&
          !target.classList.contains("settings-icon")
        ) {
          menu.classList.remove("active");
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", Initialize);
