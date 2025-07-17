# MediHelp Backend - Google Sheets Integration

## Setup Instructions

1. **Google Cloud Setup**
   - Create a Google Cloud project.
   - Enable the Google Sheets API.
   - Create a Service Account and download the credentials JSON file.
   - Share your Google Sheet with the service account email (from the credentials file).

2. **Backend Setup**
   - Place your credentials JSON file in the `backend` folder and rename it to `credentials.json`.
   - Run `npm install` in the `backend` folder to install dependencies.
   - Start the server with `npm start` or `node server.js`.

3. **Frontend Integration**
   - Update your frontend's fetch URL to `http://localhost:3001/submit` (or your deployed backend URL).

4. **Test**
   - Submit the contact form and check your Google Sheet for new entries.

---

**Note:**
- The backend expects POST requests with JSON: `{ name, email, message }`.
- The sheet tab name must match the `SHEET_NAME` in `server.js` (default: `Sheet1`). 