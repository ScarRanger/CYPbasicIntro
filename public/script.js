let slideIndex = 0;
const carouselInner = document.getElementById('carouselInner');
const items = document.querySelectorAll('.carousel-item');

function showSlide(index) {
    carouselInner.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % items.length;
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + items.length) % items.length;
    showSlide(slideIndex);
}

setInterval(nextSlide, 5000);

document.addEventListener('DOMContentLoaded', function() {
    const bibleVersesUnlockTime = new Date('2025-03-31T10:45:00+05:30').getTime(); // Example: 10:00 AM IST

    const bibleHeroesUnlockTime = new Date('2025-03-31T10:45:00+05:30').getTime(); // Example: 12:00 PM IST

    function checkTimeAndUnlock(buttonId, unlockTime, unlockedText, unlockedAction) {
        function check() {
            const now = Date.now();
            const nowIST = now + (330 * 60 * 1000); // Convert to IST

            const button = document.getElementById(buttonId);

            if (nowIST >= unlockTime) {
                button.classList.remove('locked');
                button.innerHTML = unlockedText;
                button.onclick = unlockedAction;
            } else {
                setTimeout(check, 1000); // Check every second
            }
        }
        check();
    }

    function unlockBibleVerses() {
        window.location.href = "verse.html";
    }

    function unlockBibleHeroes() {
        window.location.href = "biblehero/index.html";
    }

    // Initialize time checks
    checkTimeAndUnlock('bibleVersesButton', bibleVersesUnlockTime, 'Bible Verses', unlockBibleVerses);
    checkTimeAndUnlock('bibleHeroesButton', bibleHeroesUnlockTime, 'Bible Heroes', unlockBibleHeroes);
});