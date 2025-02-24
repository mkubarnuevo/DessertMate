document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const manageMenuLink = document.querySelector('a[href="MANAGE MENU PAGE.html"]');

    if (user && manageMenuLink) {
        if (user.admin == true) {
            manageMenuLink.style.display = 'block';
        } else {
            manageMenuLink.style.display = 'none';
        }
    }
});