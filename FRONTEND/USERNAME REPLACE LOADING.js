document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const usernameDisplay = document.querySelector('.username');

    if (user && user.username) {
        usernameDisplay.textContent = user.username;
    } else {
        usernameDisplay.textContent = 'User';
    }
});