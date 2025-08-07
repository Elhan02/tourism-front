export function InitializeAvatarOptions(): void {
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
