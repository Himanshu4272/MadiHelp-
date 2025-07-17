const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SPREADSHEET_ID = '1_I_kt1jg_RWkbnYWP3HRPmqlzyaqHdD6-snkn3oqbF8'; // Your sheet ID
const SHEET_NAME = 'Sheet1'; // Change if your tab name is different

// Load credentials
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

// Auth setup
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[new Date().toLocaleString(), name, email, message]],
      },
    });

    res.json({ result: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 