// Font scaling
let fontScale = 1;

function adjustFontSize(factor) {
  fontScale += factor;
  const newSize = fontScale * 16; // base is 16px
  document.documentElement.style.fontSize = newSize + "px";
}

function setFontType(fontFamily) {
  document.body.style.fontFamily = fontFamily;
}

// Contact form handler
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = {
        name: this.name.value,
        email: this.email.value,
        message: this.message.value,
      };

      try {
        const response = await fetch("https://craftnest-backend-s6sm.onrender.com/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        alert(result.message || "Message sent!");
        this.reset();
      } catch (err) {
        alert("Failed to send message: " + err.message);
      }
    });
  }
});

