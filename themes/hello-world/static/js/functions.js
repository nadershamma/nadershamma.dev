document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("toggle-mobile-menu-button").addEventListener('click', function (e) {
        e.target.classList.toggle('is-active');
        document.getElementById('main-menu').classList.toggle('is-active');
    })
});