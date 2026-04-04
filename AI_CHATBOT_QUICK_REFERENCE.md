# AI Chatbot - Quick Reference Guide

## 🚀 Quick Start (30 seconds)

1. **Open the app** → http://localhost:5174/
2. **Look for floating button** → Bottom-right corner
3. **Click the button** → Chat opens
4. **Type a symptom** → e.g., "fever and cough"
5. **Press Enter** → AI analyzes
6. **See results** → Severity + Bed recommendation
7. **Hospitals filter** → Shows recommendations
8. **Done!** → Click X to close or explore more

---

## 💬 Example Conversations

### Example 1: Mild Case
```
You: "I have a cold and sore throat"

Bot: 
Assessment Complete:
📊 Severity: Mild
🏥 Recommended: General Bed
Advice: Your symptoms appear mild and manageable. General bed admission or 
outpatient care may be sufficient. Rest and hydration recommended.

Result: Shows hospitals with General beds available
```

### Example 2: Moderate Case
```
You: "High fever and pneumonia symptoms"

Bot:
Assessment Complete:
📊 Severity: Moderate
🏥 Recommended: Oxygen Bed
Advice: Your symptoms suggest moderate respiratory involvement. Oxygen support 
and monitoring recommended.

Result: Shows hospitals with Oxygen or ICU beds available
```

### Example 3: Severe Case
```
You: "Chest pain and difficulty breathing"

Bot:
Assessment Complete:
📊 Severity: Severe
🏥 Recommended: ICU
Advice: Your symptoms indicate severe medical emergency. Seeking immediate 
ICU-level care. Call emergency services (108) immediately.

Result: Shows hospitals with ICU beds + emergency alert
```

---

## 🎯 Key Symptom Keywords

### Severe (→ ICU)
- Chest pain
- Heart attack
- Stroke
- Can't breathe / Respiratory distress
- Unconscious
- Severe trauma / Accident
- Seizure

### Moderate (→ Oxygen)
- Shortness of breath
- High fever
- Pneumonia
- Bronchitis
- Breathing issues
- Severe infection

### Mild (→ General)
- Cold
- Cough
- Headache
- Sore throat
- Mild fever
- Fatigue
- Nausea

---

## 🎨 UI Overview

```
┌──────────────────────────┐
│ 🏥 Medical Triage Chat  │ ← Header (Blue gradient)
│ AI-Powered Assessment   │
├──────────────────────────┤
│                          │
│ Bot: Hello! I'm your    │ ← Bot message (Gray)
│ medical triage...       │
│                          │
│ You: fever and cough    │ ← User message (Blue)
│                          │
│ Bot: Assessment...      │
│ ┌────────────────────┐  │
│ │ 🟢 Mild    75%    │  │ ← Triage card
│ │ 🏥 General        │  │
│ └────────────────────┘  │
│                          │
├──────────────────────────┤
│ ⚠️ This is not medical..│ ← Disclaimer
├──────────────────────────┤
│ Describe symptoms... [→] │ ← Input
└──────────────────────────┘

🗨️ Floating button: Bottom-right corner
```

---

## ⚙️ Settings & Customization

### For Users:
- No settings needed
- Chatbot is always available
- Click to open/close anytime
- Clear filter anytime with alert dismiss

### For Developers:

**Add Custom Keywords** (src/lib/ai.ts):
```typescript
const severeKeywords = [
  'chest pain',
  'your_keyword_here',  // Add here
];
```

**Update Bed Recommendations** (src/lib/ai.ts):
```typescript
export async function analyzeSymptoms(symptoms: string): Promise<TriageResult> {
  // Add new logic here
}
```

**Enable OpenAI** (.env.local):
```
VITE_OPENAI_API_KEY=sk-your-key-here
```

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Button not showing | Scroll to bottom-right of page |
| Chat won't open | Refresh page, check console |
| AI not responding | Check browser console for errors |
| Wrong recommendations | Describe symptoms more clearly |
| Filter not updating | Try clicking X to clear and re-open |
| Mobile layout broken | Ensure viewport is set correctly |

---

## 📱 Mobile Experience

**Optimized for:**
- ✓ iPhone/iPad
- ✓ Android phones
- ✓ Tablets
- ✓ Full desktop responsiveness

**Mobile Features:**
- Full-screen chat on small devices
- Touch-friendly buttons
- Thumb-accessible floating button
- Auto-hide keyboard after send
- Scrollable message area

---

## 🏥 Hospital Integration

**What Happens After Triage:**

1. AI recommends bed type (e.g., ICU)
2. `mapRecommendationToAvailableBeds()` maps to available beds
3. App filters hospitals with matching beds
4. Alert banner shows what's being filtered
5. User sees only relevant hospitals
6. Click X on alert to clear filter

**Bed Type Mapping:**
- General → Shows "General" beds only
- Oxygen → Shows "Oxygen" + "ICU" beds
- ICU → Shows "ICU" + "Ventilator" beds
- Ventilator → Shows "Ventilator" + "ICU" beds
- Cardiac → Shows "Cardiac" + "ICU" beds

---

## 📊 Confidence Scores

Each triage result includes a confidence score (0-1):

- **0.85+** = High confidence (clear symptoms)
- **0.75-0.85** = Good confidence (keyword matched)
- **0.6-0.75** = Moderate confidence (complex symptoms)
- **<0.6** = Lower confidence (ambiguous, safe fallback)

---

## ✅ What's Included

**Files Created:**
- ✅ `src/lib/ai.ts` - AI analysis engine
- ✅ `src/components/AIChatbot.tsx` - Chat component
- ✅ `CHATBOT_IMPLEMENTATION.md` - Full documentation
- ✅ `AI_CHATBOT_INTEGRATION.md` - Integration guide
- ✅ `AI_CHATBOT_QUICK_REFERENCE.md` - This file

**Files Modified:**
- ✅ `src/App.tsx` - Chatbot integration
- ✅ `src/components/AlertBanner.tsx` - Alert enhancements
- ✅ `src/data/mockHospitals.ts` - Import fix

**Code Quality:**
- ✅ TypeScript strict mode
- ✅ Full type safety
- ✅ ESLint compliant
- ✅ Production build passes
- ✅ Zero breaking changes

---

## 🎓 Learning Resources

**Inside the Code:**
- Read comments in `src/lib/ai.ts` for rule-based logic
- Check `src/components/AIChatbot.tsx` for UI patterns
- Review state management in updated `src/App.tsx`

**Full Docs:**
- See `CHATBOT_IMPLEMENTATION.md` for API reference
- See `AI_CHATBOT_INTEGRATION.md` for architecture details

---

## 📞 Support Checklist

Before reaching out for support:
- [ ] Checked browser console for errors
- [ ] Tried refreshing the page
- [ ] Tested with different symptom descriptions
- [ ] Verified dev server is running (http://localhost:5174/)
- [ ] Read the relevant documentation file

---

## 🎉 You're All Set!

The AI Medical Triage Chatbot is now:
- ✅ Fully integrated
- ✅ Production ready
- ✅ Type-safe
- ✅ Mobile responsive
- ✅ Well-documented

**Next Steps:**
1. Open http://localhost:5174/ in your browser
2. Look for the floating chat button
3. Click to open and start chatting
4. Report any issues via console

Enjoy! 🚀
