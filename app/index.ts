const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logout') as HTMLElement;
const restaurantsLink = document.querySelector('#restaurants') as HTMLElement;
const toursLink = document.querySelector('#tours') as HTMLElement;
const touristToursLink = document.querySelector('#tourist-tours') as HTMLElement;
const touristRestaurantLink = document.querySelector('#tourist-restaurants') as HTMLElement;

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
        const userRole = localStorage.getItem("role");
        if(userRole.trim()==="vlasnik"){
            restaurantsLink.style.display = 'block';
            toursLink.style.display = 'none';
            touristToursLink.style.display = 'none';
            touristRestaurantLink.style.display = 'none';
        } else if(userRole.trim()==="vodic"){
            restaurantsLink.style.display = 'none';
            toursLink.style.display = 'block';
            touristToursLink.style.display = 'none';
            touristRestaurantLink.style.display = 'none';
        }else if (userRole.trim()==='turista'){
            restaurantsLink.style.display = 'none';
            toursLink.style.display = 'none';
            touristToursLink.style.display = 'block';
            touristRestaurantLink.style.display = 'block';
        }
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
        window.location.href = "/app/users/pages/login/login.html"
    }
}

function handleLogout() {
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

 const logoutElement = document.querySelector('#logout');
if (logoutElement) {
    logoutElement.addEventListener('click', handleLogout);
}

checkLoginStatus();
