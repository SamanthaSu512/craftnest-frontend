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

// Market listings logic
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = (location.protocol === "file:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "http://localhost:3001"
    : "https://craftnest-backend-s6sm.onrender.com";
  const listingForm = document.getElementById("listingForm");
  const marketList = document.getElementById("marketList");

  function createCard(listing) {
    const card = document.createElement("div");
    card.className = "listing-card" + (listing.sold ? " sold" : "");

    const imgUrl = listing.imageUrl && listing.imageUrl.trim() !== "" ? listing.imageUrl : "../images/market/marketimage1.jpg";

    card.innerHTML = `
      <div class="listing-image" style="background-image:url('${imgUrl}')"></div>
      <div class="listing-body">
        <h3 class="listing-title">${listing.title}</h3>
        <p class="listing-price">$${Number(listing.price).toFixed(2)}</p>
        <p class="listing-description">${listing.description}</p>
        <p class="listing-contact">Contact: ${listing.contact}</p>
        <div class="listing-actions">
          <button class="like-btn" aria-label="Like">❤️ <span class="like-count">${listing.likes || 0}</span></button>
          <button class="buy-btn" ${listing.sold ? "disabled" : ""}>${listing.sold ? "Sold" : "Buy"}</button>
          <button class="delete-btn" aria-label="Delete">Delete</button>
        </div>
      </div>
    `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", async () => {
      try {
        const res = await fetch(`${API_BASE}/listings/${listing.id}/like`, { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          likeBtn.querySelector(".like-count").textContent = data.likes;
        } else {
          alert(data.message || "Failed to like");
        }
      } catch (e) {
        console.error(e);
        alert("Network error");
      }
    });

    const buyBtn = card.querySelector(".buy-btn");
    buyBtn.addEventListener("click", async () => {
      try {
        const res = await fetch(`${API_BASE}/listings/${listing.id}/buy`, { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          buyBtn.textContent = "Sold";
          buyBtn.disabled = true;
          card.classList.add("sold");
        } else {
          alert(data.message || "Failed to buy");
        }
      } catch (e) {
        console.error(e);
        alert("Network error");
      }
    });

    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Delete this listing?")) return;
      try {
        const res = await fetch(`${API_BASE}/listings/${listing.id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
          card.remove();
        } else {
          alert(data.message || "Failed to delete");
        }
      } catch (e) {
        console.error(e);
        alert("Network error");
      }
    });

    return card;
  }

  async function loadListings() {
    if (!marketList) return;
    marketList.innerHTML = "";
    try {
      const res = await fetch(`${API_BASE}/listings`);
      const listings = await res.json();
      if (Array.isArray(listings)) {
        listings
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .forEach(l => marketList.appendChild(createCard(l)));
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (listingForm) {
    listingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(listingForm);
      const payload = {
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
        contact: formData.get("contact"),
        imageUrl: formData.get("imageUrl"),
      };
      try {
        const res = await fetch(`${API_BASE}/listings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Failed to post listing");
          return;
        }
        listingForm.reset();
        await loadListings();
      } catch (e) {
        console.error(e);
        alert("Network error");
      }
    });
  }

  // Load on page ready
  loadListings();
});

