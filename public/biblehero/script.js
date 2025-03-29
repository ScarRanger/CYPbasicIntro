document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quizForm');
    const resultDiv = document.getElementById('result');
    const heroResultText = document.getElementById('heroResultText');
    const heroImage = document.getElementById('heroImage');
    const submitButton = document.getElementById('submitButton');

    const submitted = localStorage.getItem('quizSubmitted');
    if (submitted) {
        form.style.display = 'none';
        resultDiv.style.display = 'block';
        heroResultText.textContent = localStorage.getItem('quizResultText');
        heroImage.src = localStorage.getItem('heroImageSrc');
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const answers = {};
        for (let i = 1; i <= 10; i++) {
            answers[`q${i}`] = document.querySelector(`input[name="q${i}"]:checked`)?.value;
        }

        const counts = { A: 0, B: 0, C: 0, D: 0 };
        for (const key in answers) {
            counts[answers[key]]++;
        }

        let resultText = '';
        let imageSrc = '';

        if (counts.A > counts.B && counts.A > counts.C && counts.A > counts.D) {
            resultText = "You are DAVID (The Fearless Warrior)!";
            imageSrc = "images/david.jpg"; // Replace with your image path
        } else if (counts.B > counts.A && counts.B > counts.C && counts.B > counts.D) {
            resultText = "You are SOLOMON (The Wise King)!";
            imageSrc = "images/solomon.jpeg"; // Replace with your image path
        } else if (counts.C > counts.A && counts.C > counts.B && counts.C > counts.D) {
            resultText = "You are ELIJAH (The Fiery Prophet)!";
            imageSrc = "images/elijha.jpg"; // Replace with your image path
        } else if (counts.D > counts.A && counts.D > counts.B && counts.D > counts.C) {
            resultText = "You are JOSEPH (The Faithful Dreamer)!";
            imageSrc = "images/joseph.jpg"; // Replace with your image path
        } else if (counts.A + counts.C > counts.B + counts.D) {
            resultText = "You are SAMSON (The Strong Champion)!";
            imageSrc = "images/samson.webp"; // Replace with your image path
        } else {
            resultText = "You are MOSES (The Faithful Leader)!";
            imageSrc = "images/moses.jpg"; // Replace with your image path
        }

        heroResultText.textContent = resultText;
        heroImage.src = imageSrc;
        resultDiv.style.display = 'block';
        form.style.display = 'none';

        localStorage.setItem('quizSubmitted', 'true');
        localStorage.setItem('quizResultText', resultText);
        localStorage.setItem('heroImageSrc', imageSrc);
    });
});