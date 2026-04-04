# 🔗 Pabbly Webhook Integration Guide

## What is Pabbly?

**Pabbly** is a workflow automation tool that connects different apps and services. When a booking is created in MediFind, it automatically triggers actions like:

- 📧 Send confirmation email to patient
- 💬 Send SMS notification
- 📱 Add contact to CRM (Salesforce, HubSpot, etc.)
- 💾 Save to Google Sheets automatically
- 📱 Send WhatsApp message
- 🔔 Post to Slack channel
- 📊 Create entry in database
- 🎫 Generate support ticket
- ... and hundreds more integrations!

---

## Quick Setup (5 minutes)

### Step 1: Add Webhook URL to `.env.local`

In your project root, add:

```env
# Pabbly Webhook URL for booking automation
VITE_PABBLY_WEBHOOK_URL=https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZmMDYzMTA0M2M1MjZhNTUzNTUxMzIi_pc
```

### Step 2: Restart Dev Server

```bash
npm run dev
```

### Step 3: Test the Integration

1. Open http://localhost:5173
2. Book a bed
3. Check Pabbly workflow dashboard (or your configured destination)
4. You should see the booking data!

---

## What Data Is Sent to Pabbly?

When a booking is submitted, Pabbly receives:

```json
{
  "timestamp": "4/4/2026 3:45 PM",
  "patientName": "John Doe",
  "age": "35",
  "phone": "9876543210",
  "hospitalName": "City Hospital ICU",
  "bedType": "ICU",
  "symptoms": "Fever, difficulty breathing",
  "status": "Pending",
  "bookingId": "BOOK-1712234700000"
}
```

---

## Popular Automation Ideas

### 1. **Send Confirmation Email**
```
Trigger: Booking received
Action: Send email to patient
Template: "Your bed is confirmed at {hospitalName}"
```

### 2. **SMS Notification**
```
Trigger: Booking received
Action: Send SMS to {phone}
Message: "MediFind: Bed booked at {hospitalName}. Confirmation ID: {bookingId}"
```

### 3. **CRM Integration (Salesforce/HubSpot)**
```
Trigger: Booking received
Action: Create contact in CRM
Fields: Name, Phone, Hospital, Bed Type
```

### 4. **Google Sheets Backup**
```
Trigger: Booking received
Action: Append row to Google Sheet
Columns: Timestamp, Name, Phone, Hospital, Status
```

### 5. **Slack Alert**
```
Trigger: Booking received
Action: Post to #bookings channel
Message: "🏥 New booking: {patientName} at {hospitalName}"
```

### 6. **WhatsApp Message**
```
Trigger: Booking received
Action: Send WhatsApp message
Template: "Your bed booking is confirmed. Booking ID: {bookingId}"
```

---

## Step-by-Step: Create Pabbly Workflow

### 1. Go to Pabbly Connect

Visit: https://www.pabbly.com/connect/

### 2. Create New Workflow

1. Click "Create Workflow"
2. Name it: `MediFind Booking Automation`
3. Click "Create"

### 3. Add Webhook Trigger

1. Click "Add App"
2. Search for "Webhook"
3. Select "Webhooks by Zapier" or "Custom Webhook"
4. Choose "Catch Hook"
5. Copy the webhook URL provided
6. **Replace** this URL in your `.env.local`:
   ```env
   VITE_PABBLY_WEBHOOK_URL=https://connect.pabbly.com/workflow/sendwebhookdata/...
   ```

### 4. Add Action (Email Example)

1. Click "Add App" in the next step
2. Search for "Gmail" or "Email"
3. Connect your email account
4. Set template:
   ```
   To: {patientName}@example.com
   Subject: Your Hospital Bed Booking - {bookingId}
   Body: 
   Dear {patientName},
   
   Your bed has been reserved at {hospitalName}.
   
   Bed Type: {bedType}
   Phone: {phone}
   
   You will be contacted shortly.
   
   Best regards,
   MediFind Team
   ```

### 5. Test the Workflow

1. Click "Test"
2. Fill in sample data
3. Submit to test email sending

### 6. Activate Workflow

1. Click "Publish"
2. Workflow is now LIVE

---

## Advanced: Multiple Actions in One Workflow

You can chain multiple actions:

```
Webhook Trigger (Booking received)
    ↓
Send Email
    ↓
Send SMS
    ↓
Create Salesforce Contact
    ↓
Post to Slack
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook not receiving data | Verify `.env.local` has correct URL |
| Data not formatted correctly | Check JSON payload format in Console |
| Actions not triggering | Ensure Pabbly workflow is "Published" |
| Rate limiting | Pabbly has generous free tier (500 tasks/month) |

---

## Security Best Practices

✅ **What we do:**
- Webhook URL in `.env.local` (git-ignored)
- No sensitive data in booking form
- Booking ID generated with timestamp

⚠️ **For Production:**
- Use backend endpoint to call webhook
- Store webhook URL in server environment
- Add authentication token to webhook
- Enable Pabbly IP whitelist

---

## Pabbly Free Tier

- ✅ Up to **500 tasks/month** (free)
- ✅ **50+ app integrations** included
- ✅ Email, SMS, CRM, Spreadsheets
- ✅ **No credit card required**
- 💰 After 500 tasks: $15-30/month plans

---

## Integration with Google Sheets

If you want **both** destinations:

```
Booking submitted
    ↓
Send to Pabbly webhook ✓ (Current setup)
    ↓
Pabbly appends to Google Sheets
    ↓
Pabbly sends email
    ↓
Pabbly sends SMS
```

This keeps everything centralized in Pabbly!

---

## Example Pabbly Workflow JSON

```json
{
  "timestamp": "4/4/2026 3:45 PM",
  "bookingId": "BOOK-1712234700000",
  "patientName": "John Doe",
  "age": "35",
  "phone": "+919876543210",
  "hospitalName": "City Hospital ICU",
  "bedType": "ICU",
  "symptoms": "Fever, difficulty breathing",
  "status": "Pending",
  "source": "MediFind Mobile App",
  "environment": "production"
}
```

Use these fields in your Pabbly workflow templates!

---

## Next Steps

1. ✅ Add `VITE_PABBLY_WEBHOOK_URL` to `.env.local`
2. ✅ Create Pabbly workflow
3. ✅ Add actions (email, SMS, CRM, etc.)
4. ✅ Publish workflow
5. ✅ Test by making a booking
6. 🎉 Bookings auto-process!

---

## Support

- **Pabbly Docs:** https://www.pabbly.com/support/
- **Pabbly Community:** https://www.pabbly.com/forum/
- **Contact Pabbly:** support@pabbly.com

---

## Files Updated

- `src/lib/googleSheets.ts` — Added `sendBookingToPabblyWebhook()`
- `src/components/BookingModal.tsx` — Now calls Pabbly webhook on submit

---

**Status:** ✅ Ready to integrate
**Last Updated:** April 4, 2026
