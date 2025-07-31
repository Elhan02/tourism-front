import { TourService } from "../../service/tour.service.js";
import { TourResults } from "../../model/TourResults.js";

const tourService = new TourService();

function Initialize(): void {
  InitializeAvatarOptions();
  InitializeFilters();
  RenderTours();
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

function InitializeFilters(): void {
  const sortDropdown = document.querySelector(
    "#sortDropdown"
  ) as HTMLSelectElement;
  const orderDropdown = document.querySelector(
    "#orderDropdown"
  ) as HTMLSelectElement;

  sortDropdown.addEventListener("change", () => {
    RenderTours(sortDropdown.value, orderDropdown.value);
  });

  orderDropdown.addEventListener("change", () => {
    RenderTours(sortDropdown.value, orderDropdown.value);
  });

  const pageSizeDropdown = document.querySelector('#pageSize') as HTMLSelectElement;
  pageSizeDropdown.addEventListener("change", () => {
    RenderTours(sortDropdown.value, orderDropdown.value, currentPage, parseInt(pageSizeDropdown.value));
  })

  const prevPageButton = document.getElementById(
    "prevPage"
  ) as HTMLButtonElement;
  const nextPageButton = document.getElementById(
    "nextPage"
  ) as HTMLButtonElement;

  let currentPage = 1;

  prevPageButton.addEventListener("click", () => {
    currentPage--;
    RenderTours(sortDropdown.value, orderDropdown.value, currentPage, parseInt(pageSizeDropdown.value));
  });

  nextPageButton.addEventListener("click", () => {
    currentPage++;
    RenderTours(sortDropdown.value, orderDropdown.value, currentPage, parseInt(pageSizeDropdown.value));
  });


}

function RenderTours(
  orderBy: string = "Name",
  orderDirection: string = "asc",
  currentPage: number = 1,
  pageSize: number = 10
): void {
  const tourContainer = document.querySelector(".tours-container");
  const prevPageButton = document.getElementById("prevPage") as HTMLButtonElement;
  const nextPageButton = document.getElementById("nextPage") as HTMLButtonElement;
  tourContainer.innerHTML = "";
  tourService.getAllPublished(orderBy, orderDirection, currentPage, pageSize).then((tourData: TourResults) => {

    let totalPages = 1;
    const totalCount = tourData.totalCount;
    totalPages = Math.ceil(totalCount / pageSize);

    const showCurrentPage = document.querySelector('.current-page');
    showCurrentPage.textContent = `${currentPage.toString()} of ${totalPages}`;

    prevPageButton.disabled = currentPage === 1; 
    nextPageButton.disabled = currentPage === totalPages;

    for (const tour of tourData.data) {
        const tourCard = document.createElement("div");
        tourCard.className = "tour-card";

        const leftSide = document.createElement("div");
        leftSide.className = "tour-card-left";

        const rightSide = document.createElement("div");
        rightSide.className = "tour-card-right";

        const tourName = document.createElement("h2");
        tourName.id = "tourName";
        tourName.textContent = tour.name;
        leftSide.appendChild(tourName);

        const tourDesc = document.createElement("p");
        if (tour.description.length > 250) {
          tourDesc.textContent = tour.description.slice(0, 250) + "...";
        } else {
          tourDesc.textContent = tour.description;
        }
        rightSide.appendChild(tourDesc);

        const tourStart = document.createElement("p");
        tourStart.innerHTML = `<i class="fa-solid fa-clock"></i> ${new Date(tour.dateTime).toLocaleString("sv-SE")}`;
        leftSide.appendChild(tourStart);

        const tourMaxGuests = document.createElement("p");
        tourMaxGuests.innerHTML = `<i class="fa-solid fa-person"></i> ${tour.maxGuests.toString()}`;
        leftSide.appendChild(tourMaxGuests);

        tourCard.appendChild(leftSide);
        tourCard.appendChild(rightSide);

        attachTourCardClickListener(tourCard, tour.id)

        tourContainer.appendChild(tourCard);
    }
  });
}

function attachTourCardClickListener(tourCard, tourId){
  tourCard.addEventListener('click', () => {
    window.location.href = `../touristTourDetails/touristTourDetails.html?id=${tourId}`;
  })
}

document.addEventListener("DOMContentLoaded", Initialize);
