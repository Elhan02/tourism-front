const loginLink = document.querySelector('#login') as HTMLElement;
const userLink = document.querySelector('#user') as HTMLElement;
const username = document.querySelector('.username') as HTMLElement;
const restaurantsLink = document.querySelector('#restaurants') as HTMLElement;
const toursLink = document.querySelector('#tours') as HTMLElement;
const touristToursLink = document.querySelector('#tourist-tours') as HTMLElement;
const touristRestaurantLink = document.querySelector('#tourist-restaurants') as HTMLElement;
const touristReservations = document.querySelector('#myReservations') as HTMLElement;

function InitializeAvatarOptions(): void {
    const avatarBtn = document.getElementById('avatarBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    avatarBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!avatarBtn.contains(target) && !dropdownMenu.contains(target)) {
            dropdownMenu.style.display = 'none';
        }
  });
}

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        userLink.style.display = 'block';
        InitializeAvatarOptions()
        username.textContent = localStorage.getItem('username');
        const userRole = localStorage.getItem("role");
        if(userRole.trim()==="vlasnik"){
            restaurantsLink.style.display = 'block';
            toursLink.style.display = 'none';
            touristToursLink.style.display = 'none';
            touristRestaurantLink.style.display = 'none';
            touristReservations.style.display = 'none';
        } else if(userRole.trim()==="vodic"){
            restaurantsLink.style.display = 'none';
            toursLink.style.display = 'block';
            touristToursLink.style.display = 'none';
            touristRestaurantLink.style.display = 'none';
            touristReservations.style.display = 'none';
        }else if (userRole.trim()==='turista'){
            restaurantsLink.style.display = 'none';
            toursLink.style.display = 'none';
            touristToursLink.style.display = 'block';
            touristRestaurantLink.style.display = 'block';
        }
    } else {
        loginLink.style.display = 'block';
        userLink.style.display = 'none';
        window.location.href = "/app/users/pages/login/login.html"
    }
}

export function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    setUserLoginState(false);
}
function checkLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        setUserLoginState(true);
    } else {
        setUserLoginState(false);
    }
}

 const logoutElement = document.querySelector('#logoutBtn');
if (logoutElement) {
    logoutElement.addEventListener('click', handleLogout);
}

checkLoginStatus();
