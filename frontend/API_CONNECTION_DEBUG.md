# 🔍 API Connection Debugging Guide

## Current Issue
Getting "Failed to generate response" error when sending messages in the chatbot.

## Root Causes

Based on your console logs, there are multiple issues:

### 1. Network Connectivity Issues ⚠️
```
ERR_INTERNET_DISCONNECTED
ERR_NETWORK_CHANGED
```
Your internet connection is unstable or dropping during requests.

### 2. Supabase Auth Failing
```
Failed to load resource: net::ERR_INTERNET_DISCONNECTED
azjuwdasjqbwpgpzsnue.supabase.co/auth/v1/token
```
Supabase can't refresh your auth token due to network issues.

### 3. Backend API Not Responding
```
Backend URL: https://stevie-api.onrender.com
```
The backend might be:
- Down or sleeping (Render free tier sleeps after inactivity)
- Not responding due to network issues
- Returning errors

## Quick Fixes

### Fix 1: Check Your Internet Connection

```bash
# Test if you can reach the internet
ping google.com

# Test if you can reach Supabase
ping azjuwdasjqbwpgpzsnue.supabase.co

# Test if you can reach your backend
curl https://stevie-api.onrender.com/health
```

### Fix 2: Wake Up Your Backend (Render Free Tier)

If your backend is on Render's free tier, it sleeps after 15 minutes of inactivity:

```bash
# Wake it up by making a request
curl https://stevie-api.onrender.com/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","message":"hello"}'
```

**Or visit in browser:**
```
https://stevie-api.onrender.com
```

Wait 30-60 seconds for it to wake up, then try again.

### Fix 3: Check Backend Status

1. **Open your Render dashboard:**
   - Go to https://dashboard.render.com
   - Check if your service is running
   - Look for any errors in logs

2. **Check backend logs:**
   - Click on your service
   - Go to "Logs" tab
   - Look for errors or crashes

### Fix 4: Verify Environment Variables

Make sure your `.env.local` has the correct backend URL:

```bash
# Check current value
cat frontend/.env.local | grep API_URL

# Should show:
NEXT_PUBLIC_API_URL=https://stevie-api.onrender.com
```

### Fix 5: Test API Directly

Open browser DevTools → Console and run:

```javascript
// Test if backend is reachable
fetch('https://stevie-api.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('Backend is up:', d))
  .catch(e => console.error('Backend is down:', e));

// Test chat endpoint
fetch('https://stevie-api.onrender.com/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream'
  },
  body: JSON.stringify({
    session_id: 'test-123',
    message: 'hello'
  })
})
.then(r => console.log('Chat API status:', r.status))
.catch(e => console.error('Chat API error:', e));
```

## Debugging Steps

### Step 1: Check Console Logs

With the updated code, you'll now see detailed logs:

```
Sending chat request to: /api/chat
Session ID: xxx-xxx-xxx
Message: your message
Response status: 200
Response ok: true
Received payload: {...}
```

### Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Filter by "chat"
3. Send a message
4. Click on the "chat" request
5. Check:
   - **Status:** Should be 200
   - **Type:** Should be "text/event-stream"
   - **Response:** Should show streaming data

### Step 3: Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Network error: Unable to reach backend" | Backend is down or network issue | Wake up backend, check internet |
| "Backend returned 500" | Backend crashed | Check backend logs |
| "Backend returned 401" | Auth token expired | Refresh page, log in again |
| "Backend returned 429" | Rate limited | Wait 60 seconds |
| "No data received from server" | Backend not streaming | Check backend streaming code |
| "Session expired" | Supabase session expired | Refresh page, log in again |

## Solutions by Error Type

### Network Errors

**Symptoms:**
- `ERR_INTERNET_DISCONNECTED`
- `ERR_NETWORK_CHANGED`
- `Failed to fetch`

**Solutions:**
1. Check your WiFi/internet connection
2. Try switching networks
3. Disable VPN if using one
4. Check firewall settings
5. Try in incognito mode

### Backend Errors

**Symptoms:**
- Status 500, 502, 503, 504
- "Backend returned XXX"
- Timeout errors

**Solutions:**
1. Check Render dashboard for service status
2. Wake up the backend (if on free tier)
3. Check backend logs for errors
4. Verify backend environment variables
5. Restart the backend service

### Auth Errors

**Symptoms:**
- "Not authenticated"
- "Session expired"
- 401 Unauthorized

**Solutions:**
1. Refresh the page
2. Log out and log in again
3. Clear browser cookies
4. Check Supabase dashboard for issues

## Testing Checklist

- [ ] Internet connection is stable
- [ ] Can ping google.com
- [ ] Can reach Supabase (azjuwdasjqbwpgpzsnue.supabase.co)
- [ ] Can reach backend (stevie-api.onrender.com)
- [ ] Backend is awake (not sleeping)
- [ ] Backend logs show no errors
- [ ] Supabase auth is working
- [ ] Browser console shows detailed logs
- [ ] Network tab shows 200 status
- [ ] Response type is "text/event-stream"

## Quick Test Script

Run this in your browser console:

```javascript
// Complete diagnostic test
async function testEverything() {
  console.log('🔍 Running diagnostics...\n');
  
  // Test 1: Backend health
  try {
    const health = await fetch('https://stevie-api.onrender.com/health');
    console.log('✅ Backend health:', await health.json());
  } catch (e) {
    console.error('❌ Backend health failed:', e.message);
  }
  
  // Test 2: Supabase connection
  try {
    const { data } = await supabase.auth.getSession();
    console.log('✅ Supabase session:', data.session ? 'Valid' : 'Invalid');
  } catch (e) {
    console.error('❌ Supabase failed:', e.message);
  }
  
  // Test 3: Chat API
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        session_id: 'test-' + Date.now(),
        message: 'test'
      })
    });
    console.log('✅ Chat API status:', res.status);
  } catch (e) {
    console.error('❌ Chat API failed:', e.message);
  }
  
  console.log('\n✨ Diagnostics complete!');
}

testEverything();
```

## Still Not Working?

### Option 1: Use Local Backend

If the Render backend is having issues, run the backend locally:

```bash
# In your backend directory
npm install
npm run dev

# Update .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Option 2: Check Render Service

1. Go to https://dashboard.render.com
2. Click on your service
3. Check "Events" tab for issues
4. Check "Logs" tab for errors
5. Try manual deploy if needed

### Option 3: Contact Support

If nothing works:
1. Take screenshots of:
   - Browser console errors
   - Network tab showing failed request
   - Render dashboard showing service status
2. Check Render status page: https://status.render.com
3. Contact Render support if service is down

## Prevention

### Keep Backend Awake (Free Tier)

Create a cron job to ping your backend every 10 minutes:

```bash
# Using cron-job.org or similar
GET https://stevie-api.onrender.com/health
Every 10 minutes
```

### Monitor Backend

Set up monitoring:
- UptimeRobot (free)
- Pingdom
- Better Uptime

### Upgrade Render Plan

Consider upgrading from free tier to avoid:
- Sleep after inactivity
- Limited resources
- Slower cold starts

---

**Quick Summary:**
1. Check internet connection
2. Wake up backend (visit URL)
3. Check browser console for detailed logs
4. Check Network tab for request status
5. Verify backend is running on Render
