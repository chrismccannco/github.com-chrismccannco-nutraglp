# Google Sheets Form Integration

## 1. Create the Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it: **NutraGLP Submissions**
3. In Row 1, add these headers:
   - A1: `Timestamp`
   - B1: `Form`
   - C1: `Email`
   - D1: `Phone`
   - E1: `SMS Opt-in`
   - F1: `Source`

## 2. Add the Apps Script

1. In the sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.form || "",
    data.email || "",
    data.phone || "",
    data.sms_opt_in ? "Yes" : "No",
    data.source || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (Ctrl+S)
4. Click **Deploy → New deployment**
5. Click the gear icon → select **Web app**
6. Set:
   - Description: `NutraGLP form submissions`
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**
8. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/ABC.../exec`)

## 3. Add the URL to Netlify

1. Go to Netlify → Site settings → Environment variables
2. Add: `GOOGLE_SHEETS_WEBHOOK_URL` = the URL you copied
3. Trigger a redeploy (or push a new commit)

## How it works

- Both forms (waitlist + popup) submit to Netlify Forms AND relay to your Google Sheet
- If the Sheet webhook fails, the Netlify submission still goes through
- Each row captures: timestamp, which form, email, phone, SMS opt-in, and source page
