# 🔔 Reminders Setup Guide
## dashboard_glance_v9 — FCM Push Notifications

---

## What you're deploying

| File | Where it goes |
|---|---|
| `dashboard_glance_v9.html` | Your GitHub Pages / Netlify repo root |
| `firebase-messaging-sw.js` | Same repo root (same folder as HTML) |
| `functions/index.js` | Firebase Cloud Functions folder |

---

## Step 1 — Enable Cloud Functions in Firebase Console

1. Go to → https://console.firebase.google.com
2. Select project: **daily-self-evaluation-fcfba**
3. Left menu → **Build → Functions**
4. Click **Get started** and follow the prompt (Blaze plan required ✅)

---

## Step 2 — Enable Cloud Messaging + Add VAPID Key

1. Firebase Console → **Project Settings** (⚙️ top left)
2. Click **Cloud Messaging** tab
3. Scroll to **Web Push certificates**
4. If no key exists, click **Generate key pair**
5. Your VAPID key is already embedded in the dashboard ✅

---

## Step 3 — Set up Firebase CLI & deploy functions

In your terminal:

```bash
# Install Firebase CLI (if not already)
npm install -g firebase-tools

# Login
firebase login

# In your project root, init functions (if not done)
firebase init functions
# Choose: JavaScript, your project (daily-self-evaluation-fcfba), install deps = Yes

# Copy the functions/index.js file into your functions/ folder
# Then install deps
cd functions
npm install firebase-admin firebase-functions

# Deploy
cd ..
firebase deploy --only functions
```

After deploy, you'll see a function `sendReminders` in your Firebase Console under Functions.

---

## Step 4 — Deploy dashboard to GitHub Pages / Netlify

Copy both files to your repo root:
- `dashboard_glance_v9.html` (rename to `index.html` if that's your setup)
- `firebase-messaging-sw.js` ← **must be in root, same level as the HTML**

Push to GitHub / Netlify as usual.

**⚠️ Important:** The service worker ONLY works on HTTPS. It will not work on `file://`. GitHub Pages and Netlify both serve HTTPS automatically.

---

## Step 5 — Enable notifications on your phone

1. Open your dashboard on your phone browser
2. Navigate to **🔔 Reminders** in the sidebar
3. You'll see a banner — tap **Enable**
4. Accept the browser permission prompt
5. Status will show **"Push notifications active ✓"** in green

---

## Step 6 — Add your first reminder

1. Enter a **Title** (e.g. "Evening Hearing")
2. Set the **Time** (e.g. 19:00)
3. Choose **Repeat** (Every day / Weekdays / Weekends / Once)
4. Optional: add a short note
5. Tap **Save Reminder**

The Cloud Function checks every minute. At the exact minute you set, you'll receive a push notification — even with the browser fully closed.

---

## Timezone

The Cloud Function is set to **Asia/Kolkata (IST)** by default.
To change it, edit this line in `functions/index.js`:
```js
timeZone: "Asia/Kolkata",
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Status shows "Service worker failed to register" | Make sure `firebase-messaging-sw.js` is in the repo **root** |
| Status shows "Notifications blocked" | Go to browser site settings and allow notifications for your domain |
| Notifications not arriving | Check Firebase Console → Functions → Logs for errors |
| Token not saving to Firebase | Open browser console and look for FCM errors |
| Function not deploying | Make sure you're on Blaze plan and Functions is enabled |

---

## Data structure in Firebase Realtime Database

The dashboard writes two things to your database:

```
/reminders          ← array of reminder objects (title, time, repeat, active)
/fcm_tokens/dashboard ← { token: "...", updatedAt: ... }
```

The Cloud Function reads both to send notifications.
