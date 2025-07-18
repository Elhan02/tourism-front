import { RestaurantsServices } from "../../services/restaurant.services.js";


const restauranService = new RestaurantsServices();

let currentPage = 1;

function intializationFrom(): void {

    logout.addEventListener('click', function () {
    handleLogout()
    window.location.href = "../../../users/pages/login/login.html";
})
    const sortDropdown = document.querySelector('#sortDropdown') as HTMLSelectElement;
    const orderDropdown = document.querySelector('#orderDropdown') as HTMLSelectElement;
    const prevPageBtn = document.querySelector('#prevPage') as HTMLButtonElement;
    const nextPageBtn = document.querySelector('#nextPage') as HTMLButtonElement;
    const pageSize = document.querySelector("#pageSize") as HTMLSelectElement;    
    

    sortDropdown.addEventListener('change', () => {
        renderData(sortDropdown.value, orderDropdown.value, currentPage, parseInt(pageSize.value))
    });
    orderDropdown.addEventListener('change', () => {
        renderData(sortDropdown.value, orderDropdown.value, currentPage, parseInt(pageSize.value))
    });

    pageSize.addEventListener('change', ()=>{
        renderData(sortDropdown.value, orderDropdown.value, currentPage, parseInt(pageSize.value))
    })

    prevPageBtn.addEventListener('click',()=>{
       currentPage--;
       renderData(sortDropdown.value, orderDropdown.value, currentPage, parseInt(pageSize.value))
    });

    nextPageBtn.addEventListener('click', ()=>{
        currentPage++;
        renderData(sortDropdown.value, orderDropdown.value,  currentPage, parseInt(pageSize.value))
    })

    renderData(sortDropdown.value, orderDropdown.value,  currentPage, parseInt(pageSize.value))
}

function renderData(orderBy: string = "name", orderDirection: string = "ASC", currentPage: number = 1, pageSize: number = 10): void {
    const restaurantContainer = document.querySelector('#card-container') as HTMLDivElement;
    const prevPageButton = document.getElementById("prevPage") as HTMLButtonElement;
    const nextPageButton = document.getElementById("nextPage") as HTMLButtonElement;
    const pageInfo = document.querySelector('#page-info') as HTMLSpanElement;


        let totalPages = 1;
    restaurantContainer.innerHTML = "";
    restauranService.getAllPublishRestaurants(orderBy, orderDirection, currentPage, pageSize)
        .then(result => {
            const totalCount: number = result.totalCount;
            totalPages = Math.ceil(totalCount/pageSize) ;

            pageInfo.textContent = `${currentPage} of ${totalPages}`

            prevPageButton.disabled = currentPage === 1; 
            nextPageButton.disabled = currentPage === totalPages;  

            result.data.forEach(restaurant => {
                const restaurantCard = document.createElement('div');
                restaurantCard.classList.add('restaurant-card');

                restaurantCard.onclick = function () {
                    window.location.href=`../touristRestaurantDetails/touristRestaurantDetails.html?id=${restaurant.id}`;
                }

                const nameSectionDiv = document.createElement('div');
                nameSectionDiv.classList.add('name-side');

                const pName = document.createElement('p');
                pName.classList.add('name')
                pName.textContent = restaurant.name;

                const pCapacity = document.createElement('p');
                pCapacity.innerHTML = "<i class=\"fa-solid fa-user\"></i>"
                pCapacity.append(` x ${restaurant.capacity}`);

                nameSectionDiv.appendChild(pName);
                nameSectionDiv.appendChild(pCapacity);
                restaurantCard.appendChild(nameSectionDiv);

                const lineDiv = document.createElement('div');
                lineDiv.classList.add('vertical-line');
                restaurantCard.appendChild(lineDiv);

                const descriptionDiv = document.createElement('div');
                descriptionDiv.classList.add('description-section');

                const descriptionP = document.createElement('p');
                descriptionP.textContent = restaurant.description;
                descriptionDiv.appendChild(descriptionP);
                restaurantCard.appendChild(descriptionDiv)

                restaurantContainer.appendChild(restaurantCard);
            })

        })
}

const logout = document.querySelector('#logout');
function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
}

addEventListener('DOMContentLoaded', intializationFrom)