Author: Samantha Su
Project video: https://drive.google.com/file/d/1nDPc1oSSOvhDmqiKRrEXoRLCkUZ4-PkY/view?usp=sharing

---
RUNNING THIS PROJECT

Project structure (relevant parts):
- craftnest-frontend/  (static site served by GitHub Pages or a local static server)
  - index.html, market/market.html, styles/main.css, scripts/jscode.js
- craftnest-backend/   (Node/Express API)
  - index.js, package.json, public/ (may contain listings.json if file persistence is enabled)

Deployed setup (GitHub Pages + Render):
- Frontend: push craftnest-frontend changes to GitHub; Pages will host the static files.
- Backend: deploy craftnest-backend to Render. Note your Render URL.
- scripts/jscode.js auto-selects API_BASE:
  - Uses http://localhost:3001 when running locally
  - Uses the Render URL in production (update the constant if your Render URL changes)

Backend API (Express):
- GET  /listings              → returns all listings as JSON array
- POST /listings              → create listing (title, price, description, contact, imageUrl, optional imageAlt)
- POST /listings/:id/like     → increment likes for a listing
- POST /listings/:id/buy      → mark listing as sold
- DELETE /listings/:id        → delete listing

Data persistence:
- The backend is configured to persist listings to a JSON file (listings.json) on the server. In local dev, this file will appear within craftnest-backend (location depends on current code: next to index.js). On Render, the file lives on the server instance. If you redeploy or restart the service, data may reset depending on your hosting setup.

Market page behavior:
- On load: fetches existing listings from the backend and renders them as cards.
- Form: users can post a new listing (title, price, description, contact, required image URL, optional image description).
- Accessibility: listings include aria-labels; alt text comes from user-provided image description or a safe fallback.
- Interactions: Like, Buy (marks as Sold), Delete.

Interactive Features:
1. Font Size Adjuster
- Buttons allow users to increase or decrease the font size of the entire page content.
- Located at the bottom of all pages.
- JavaScript function 'adjustFontSize(delta)' is triggered on click.
- Font sizes are defined in 'rem' so that scaling works consistently.
Expected behavior:
- Clicking "Increase Font Size" enlarges all text.
- Clicking "Decrease Font Size" reduces all text.
- Size changes apply dynamically without refreshing the page

2. Font Type Adjuster
- A '<select>' dropdown lets users change the font family on the page.
- Calls the JavaScript function 'setFontType(value)' on selection change.
Expected behavior:
- Selecting a font from the dropdown instantly changes the font family of all text on the page.

Seeding defaults:
- The frontend seeds default listings only if the backend has zero listings. If there are any listings, seeding is skipped.

Troubleshooting:
- Listings not loading:
  - Verify backend is running (local) or your Render URL is correct.
  - Open /listings in the browser: e.g., http://localhost:3001/listings or your Render URL.
  - Hard refresh the frontend (Cmd/Ctrl+Shift+R) to clear cache.
- CORS/Network errors:
  - Ensure you are serving the frontend via http(s), not opening HTML via file://.
  - Confirm the API_BASE in scripts/jscode.js matches your backend URL in production.
- Deleting everything:
  - Use Delete buttons, or temporarily disable seeding in scripts/jscode.js, then delete all items.

Accessibility notes:
- All listing images expose descriptive labels to assistive technologies.
- Forms use required validation for key fields (title, image URL, etc.).
- If JavaScript is disabled, font controls and the market page’s dynamic features will not function.

License/Notes:
- Educational project for CS396 Web Dev. Update environment variables and backend service URLs as needed for your deployment.