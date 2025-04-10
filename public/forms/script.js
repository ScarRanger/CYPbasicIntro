document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("generalForm");
    const submitBtn = form.querySelector("button[type='submit']");
    const contactField = document.getElementById("number");
    const ageField = document.getElementById("age");
    const emailField = document.getElementById("email");

    // Helper to create error messages
    function createErrorSpan(input) {
        const span = document.createElement("div");
        span.style.color = "red";
        span.style.fontSize = "0.9em";
        span.style.marginTop = "2px";
        input.insertAdjacentElement("afterend", span);
        return span;
    }

    const contactMsg = createErrorSpan(contactField);
    const ageMsg = createErrorSpan(ageField);
    const emailMsg = createErrorSpan(emailField);

    let contactValid = false;
    let ageValid = false;
    let emailValid = false;

    function checkFormValidity() {
        if (contactValid && ageValid && emailValid) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    // Phone number validation
    contactField.addEventListener("input", () => {
        const value = contactField.value.trim();
        contactValid = /^\d{10}$/.test(value) || (/^0\d{10}$/.test(value) && value.length === 11);
        contactField.style.border = contactValid ? "2px solid green" : "2px solid red";
        contactMsg.textContent = contactValid ? "" : "Invalid number (must be 10 digits or 11 starting with 0)";
        checkFormValidity();
    });

    // Age validation
    ageField.addEventListener("input", () => {
        const age = parseInt(ageField.value, 10);
        ageValid = !isNaN(age) && age >= 15;
        ageField.style.border = ageValid ? "2px solid green" : "2px solid red";
        ageMsg.textContent = ageValid ? "" : "Minimum age required is 15";
        checkFormValidity();
    });

    // Email validation
    emailField.addEventListener("input", () => {
        const email = emailField.value.trim();
        emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        emailField.style.border = emailValid ? "2px solid green" : "2px solid red";
        emailMsg.textContent = emailValid ? "" : "Invalid email format";
        checkFormValidity();
    });

    // Disable submit by default
    submitBtn.disabled = true;

    // Seat check
    fetch("http://localhost:3000/availability")
        .then(res => res.json())
        .then(data => {
            window.remainingMale = data.remainingMale;
            window.remainingFemale = data.remainingFemale;
            updateSeatMessage(data.remainingMale, data.remainingFemale);
            if (data.remainingMale <= 0 && data.remainingFemale <= 0) {
                form.innerHTML = "<h3>😔 Sorry, all seats have been filled!</h3>";
            }
        })
        .catch(console.error);

    // Form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const gender = formData.get("Gender");

        if ((gender === "Male" && window.remainingMale <= 0) ||
            (gender === "Female" && window.remainingFemale <= 0)) {
            alert(`❌ Sorry, no seats left for ${gender}.`);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        try {
            const res = await fetch("/submit", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                window.location.href = "success.html"; // ✅ redirect to success page
            } else {
                const result = await res.json();
                alert(`❌ Error: ${result.error || "Submission failed."}`);
                submitBtn.disabled = false;
                submitBtn.innerText = "Submit";
            }
        } catch (err) {
            console.error(err);
            alert("❌ An error occurred.");
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit";
        }
    });
});

function updateSeatMessage(male, female) {
    const h2 = document.querySelector(".general-form-container h2");
    h2.innerHTML = `Remaining Seats - <span style="color:blue">Boys: ${male}</span> | <span style="color:deeppink">Girls: ${female}</span>`;
}
