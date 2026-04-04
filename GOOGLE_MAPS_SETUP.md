# Google Maps Setup Guide (5 Minutes)

## Quick Setup Steps

### Step 1: Get Google Maps API Key
1. Go to: https://console.cloud.google.com/
2. Click **"Select a Project"** → **"New Project"**
3. Enter Project Name: `MediFind` → Click **Create**
4. Wait for project creation (1-2 minutes)

### Step 2: Enable the Maps API
1. Search for **"Maps JavaScript API"** in the search bar
2. Click on it → Click **ENABLE**
3. Wait a few seconds to load

### Step 3: Create API Key
1. Click **"Create Credentials"** button (top right)
2. Select **"API Key"**
3. Copy the API Key shown in the popup (click Copy)

### Step 4: Add to Your Project
1. Open `.env.local` file in your project (in the root folder)
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your copied key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyD...your_key_here...
   ```
3. Save the file

### Step 5: Restart Dev Server
1. In the terminal running the app, press **Ctrl + C**
2. Run: `npm run dev`
3. Open http://localhost:5174/ in your browser
4. Map should now display! 🗺️

---

## Troubleshooting

### "Maps API Error" appears?
- Copy your API key correctly (no extra spaces)
- Wait 2-3 minutes for the API to activate after enabling it

### Need to Restrict API Key (Optional but Recommended)?
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your API Key
3. Under **"Key restrictions"**:
   - Select **Maps JavaScript API**
4. Under **"Application restrictions"**:
   - Select **HTTP referrers (web sites)**
   - Add: `http://localhost:5174/*` and `http://localhost:5173/*`
5. Click **Save**

---

## Current Status
- ✅ App running on http://localhost:5174/
- ⏳ Waiting for Google Maps API key
- ✅ Map section shows instructions if key is missing

Once you add the API key and restart, everything works! 🎉
