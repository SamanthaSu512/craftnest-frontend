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

    const imgUrl = (listing.imageUrl || "").trim();
    // Use the imageAlt from the listing data, or fall back to title, or generic description
    const altText = listing.imageAlt || listing.title || "Handmade craft item";

    card.innerHTML = `
      <div class="listing-image" style="background-image:url('${imgUrl}')" role="img" aria-label="${altText}"></div>
      <div class="listing-body">
        <h3 class="listing-title">${listing.title}</h3>
        <p class="listing-price">$${Number(listing.price).toFixed(2)}</p>
        <p class="listing-description">${listing.description}</p>
        <p class="listing-contact">Contact: ${listing.contact}</p>
        <div class="listing-actions">
          <button class="like-btn" aria-label="Like ${listing.title}">❤️ <span class="like-count">${listing.likes || 0}</span></button>
          <button class="buy-btn" ${listing.sold ? "disabled" : ""} aria-label="${listing.sold ? 'Item sold' : 'Buy ' + listing.title}">${listing.sold ? "Sold" : "Buy"}</button>
          <button class="delete-btn" aria-label="Delete ${listing.title}">Delete</button>
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
      const titleVal = (formData.get("title") || "").toString().trim();
      const descriptionVal = (formData.get("description") || "").toString().trim();
      if (!titleVal) {
        alert("Please enter a title.");
        return;
      }
      const payload = {
        title: titleVal,
        price: formData.get("price"),
        description: descriptionVal,
        contact: formData.get("contact"),
        imageUrl: formData.get("imageUrl"),
        imageAlt: formData.get("imageAlt") || `Image of ${titleVal} - ${descriptionVal || "No description provided"}`,
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
        alert("Network error");
      }
    });
  }

  // Default listings data
  const defaultListings = [
    {
      id: "default-origami",
      title: "Origami Cranes",
      price: 15.00,
      description: "Hand-folded paper cranes crafted with care, bringing elegance and tradition to your creative space.",
      contact: "craftnest@example.com",
      imageUrl: "../images/market/marketimage1.jpg",
      imageAlt: "Hand-folded origami paper cranes arranged in a decorative display",
      likes: 0,
      sold: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "default-plushies", 
      title: "Crochet Plushies",
      price: 25.00,
      description: "Soft, cuddly, and unique—these crochet plushies make perfect gifts or cozy companions.",
      contact: "craftnest@example.com",
      imageUrl: "../images/market/marketimage2.jpg",
      imageAlt: "Colorful crochet plushie toys including animals and cute characters",
      likes: 0,
      sold: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "default-knitting",
      title: "Knitted & Crochet Pieces",
      price: 35.00,
      description: "From scarves to home décor, these vibrant handmade pieces showcase artistry in every stitch.",
      contact: "craftnest@example.com",
      imageUrl: "../images/market/marketimage3.jpg",
      imageAlt: "Hand-knitted and crocheted items including scarves, blankets, and home decor",
      likes: 0,
      sold: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "default-watercolor",
      title: "Watercolor Artwork",
      price: 45.00,
      description: "Expressive and one-of-a-kind watercolor paintings, perfect for adding color and inspiration to your home.",
      contact: "craftnest@example.com",
      imageUrl: "../images/market/marketimage4.jpg",
      imageAlt: "Beautiful watercolor paintings with vibrant colors and artistic brushstrokes",
      likes: 0,
      sold: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Add default listings if they don't exist
  let hasInitialized = false;
  
  async function initializeDefaultListings() {
    if (hasInitialized) {
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/listings`);
      const existingListings = await res.json();
      
      // If there are ANY listings, do not add defaults
      if (Array.isArray(existingListings) && existingListings.length > 0) {
        hasInitialized = true;
        return;
      }
      
      // Backend is empty: seed defaults
      for (const listing of defaultListings) {
        try {
          const addRes = await fetch(`${API_BASE}/listings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(listing),
          });
          if (!addRes.ok) {
            // continue on failure of an individual seed
          }
        } catch (addError) {
          // continue on error
        }
      }
      hasInitialized = true;
    } catch (e) {
      // fail silently
    }
  }

  // Load on page ready
  initializeDefaultListings().then(() => loadListings());
});

