// Google Sheets integration for booking credentials
// Make sure to set these environment variables in .env.local

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID || '';
const SHEET_NAME = 'Bookings'; // Change if your sheet name is different

export interface BookingData {
  patientName: string;
  age: string;
  phone: string;
  hospitalName: string;
  bedType: string;
  symptoms: string;
}

/**
 * Save booking data to Google Sheets using Google Sheets API
 * Requires: VITE_GOOGLE_SHEETS_ID and VITE_GOOGLE_API_KEY in .env.local
 */
export async function saveBookingToGoogleSheets(booking: BookingData): Promise<boolean> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!SPREADSHEET_ID || !apiKey) {
      console.warn('Google Sheets credentials not configured. Booking not saved to sheet.');
      return false;
    }

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });

    const values = [
      [
        timestamp,
        booking.patientName,
        booking.age,
        booking.phone,
        booking.hospitalName,
        booking.bedType,
        booking.symptoms,
        'Pending', // Status column
      ],
    ];

    const resource = {
      values,
    };

    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:H:append` +
      `?valueInputOption=USER_ENTERED&key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resource),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    console.log('✅ Booking saved to Google Sheets');
    return true;
  } catch (error) {
    console.error('❌ Error saving to Google Sheets:', error);
    // Don't throw - graceful fallback
    return false;
  }
}

/**
 * Alternative: Use a backend API endpoint instead of direct API calls
 * This is more secure and recommended for production
 */
export async function saveBookingViaBackend(booking: BookingData): Promise<boolean> {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    console.log('✅ Booking saved via backend');
    return true;
  } catch (error) {
    console.error('❌ Error saving booking:', error);
    return false;
  }
}
