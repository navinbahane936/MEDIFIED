# 📊 Google Sheets Integration Guide

## Quick Summary

Your MediFind app now saves booking credentials to Google Sheets automatically when users confirm a booking.

---

## What Was Changed

### New Files:
- `src/lib/googleSheets.ts` — Google Sheets API service

### Updated Files:
- `src/components/BookingModal.tsx` — Now saves data + shows loading state

---

## Setup Checklist (Complete These Steps)

### 1. Create Google Sheet
- [ ] Go to sheets.google.com
- [ ] Create new sheet named "MediFind Bookings"
- [ ] Add headers: Timestamp | Patient Name | Age | Phone | Hospital Name | Bed Type | Symptoms | Status

### 2. Google Cloud Setup
- [ ] Create project at console.cloud.google.com
- [ ] Enable "Google Sheets API"
- [ ] Create Service Account
- [ ] Download JSON key file
- [ ] Create API key (restrict to Sheets API)

### 3. Share & Configure
- [ ] Copy Service Account email from JSON
- [ ] Share Google Sheet with that email (Editor access)
- [ ] Get Sheet ID from URL
- [ ] Create `.env.local` with:
  ```env
  VITE_GOOGLE_SHEETS_ID=your_sheet_id
  VITE_GOOGLE_API_KEY=your_api_key
  ```

### 4. Install Dependencies
- [ ] `npm install`
- [ ] Restart dev server: `npm run dev`

### 5. Test
- [ ] Open http://localhost:5173
- [ ] Book a bed
- [ ] Check Google Sheet (new row should appear)

---

## How It Works

```
BookingModal Form Submit
    ↓
Call saveBookingToGoogleSheets()
    ↓
Fetch Google Sheets API
    ↓
Append row with: [timestamp, name, age, phone, hospital, bed_type, symptoms, status]
    ↓
Show success/error message
```

---

## Environment Variables Reference

```env
# Required for Google Sheets integration
VITE_GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j_sheet_id_123
VITE_GOOGLE_API_KEY=AIzaSy_abc123xyz...

# Optional (for Supabase when enabled)
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## API Response Format

When saving a booking, the API appends rows to your sheet:

| Timestamp | Patient Name | Age | Phone | Hospital Name | Bed Type | Symptoms | Status |
|-----------|--------------|-----|-------|----------------|----------|----------|--------|
| 4/4/2026 3:45 PM | John Doe | 35 | 9876543210 | City Hospital | ICU | Fever, difficulty breathing | Pending |
| 4/4/2026 4:12 PM | Jane Smith | 28 | 9123456789 | Central Clinic | Oxygen | High fever | Pending |

---

## Viewing Bookings

1. **Real-time in Google Sheets:**
   - Open your sheet at sheets.google.com
   - Bookings appear instantly (within 2-3 seconds)

2. **Set Up Notifications:**
   - Tools → Notification rules
   - Choose: "Notify me for each change"

3. **Automate Processing:**
   - Use Google Sheets automations
   - Or export to other apps via Zapier

---

## Database Schema

Current Google Sheet columns:
```
A: Timestamp (GMT+5:30 India Standard Time)
B: Patient Name (text)
C: Age (number)
D: Phone (text)
E: Hospital Name (text)
F: Bed Type (dropdown: ICU, Oxygen, Ventilator, Cardiac, Oncology, General)
G: Symptoms (text)
H: Status (Pending, Confirmed, Cancelled)
```

---

## Security Notes

### ⚠️ Development Setup (What we did)
- API key embedded in client code
- OK for development only
- Restricted to Sheets API

### ✅ Production Setup (Recommended)
- Create backend endpoint
- Handle API key server-side
- Use environment secrets
- Add authentication

---

## Next Steps

1. **Basic Setup:** Follow checklist above (5-10 minutes)
2. **Testing:** Submit a test booking
3. **Automation:** Set up Sheet automations if needed
4. **Scaling:** Consider backend endpoint for security

---

## Support Links

- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Service Account Setup](https://cloud.google.com/docs/authentication/getting-started)

---

## File References

- Implementation: `src/lib/googleSheets.ts`
- Component Updated: `src/components/BookingModal.tsx`
- Config: `.env.local` (git-ignored)

---

**Status:** ✓ Ready to use
**Last Updated:** April 4, 2026
