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


function icebreakerUnlock() {
    const targetDateIST = new Date('2025-03-31T10:30:00+05:30');
    const targetTimeIST = targetDateIST.getTime();

    function checkTimeAndUnlock() {
        const nowUTC = Date.now();
        const nowIST = new Date(nowUTC).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        const nowISTTimestamp = new Date(nowIST).getTime();

        if (nowISTTimestamp >= targetTimeIST) {
            const container = document.getElementById('timedButtonContainer');
            if (container) {
                container.classList.add('unlocked');
                container.innerHTML = 'Click Me!';
                container.onclick = function () {
                    window.location.href = "verse.html"
                }
            }
        } else {
            setTimeout(checkTimeAndUnlock, 1000); // Check every second
        }
    }

    // Start the time check immediately
    checkTimeAndUnlock();
}

// Call icebreakerUnlock() after the page has loaded
window.onload = icebreakerUnlock;
