import { UserService } from "../../service/user.service.js";


const userService = new UserService();
const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logoutBtn') as HTMLElement;
const submitButton = document.querySelector("#submit") as HTMLElement;

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
        window.location.href = "../../../index.html";
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}

function handleLogin(event: Event) {
    event.preventDefault();

    const form = document.querySelector("form") as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    userService.login(username, password)
        .then((user) => {
            localStorage.setItem('username', user.username);
            localStorage.setItem('role', user.role);
            localStorage.setItem('id', user.id.toString());
            setUserLoginState(true);
        })
        .catch((error) => {
            console.error('Login failed', error.message);
        });
}

function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
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

if (submitButton) {
    submitButton.addEventListener("click", handleLogin);
}

const logoutElement = document.querySelector('#logoutBtn');
if (logoutElement) {
    logoutElement.addEventListener('click', handleLogout);
}

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

checkLoginStatus();
