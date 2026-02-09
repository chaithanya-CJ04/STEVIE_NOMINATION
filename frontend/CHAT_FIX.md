# 🔧 Chat Input Fix

## Issue
Users were unable to send messages in the chatbot. The send button appeared disabled or clicking it did nothing.

## Root Cause
The `handleSubmit` function was wrapped in `useCallback` with incomplete dependencies. It only had `sessionId` in the dependency array, but it also used:
- `input` - The current message text
- `loadingReply` - The loading state
- `showToast` - The toast notification function

This caused React to use **stale values** from the initial render, meaning:
- The `input` variable was always empty (`""`)
- The button check `!input.trim()` always evaluated to `true`
- The form submission was blocked

## Solution
Updated the `useCallback` dependency array to include all variables used inside the function:

```typescript
// ❌ Before (incomplete dependencies)
const handleSubmit = useCallback(async (e: FormEvent) => {
  // Uses: input, loadingReply, sessionId, showToast
}, [sessionId]); // Missing: input, loadingReply, showToast

// ✅ After (complete dependencies)
const handleSubmit = useCallback(async (e: FormEvent) => {
  // Uses: input, loadingReply, sessionId, showToast
}, [input, loadingReply, sessionId, showToast]); // All dependencies included
```

## How to Test

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to dashboard:**
   - Go to http://localhost:3000
   - Login if needed
   - Go to /dashboard

3. **Test the chat:**
   - Type a message in the input field
   - The "Send" button should be enabled
   - Click "Send" or press Enter
   - Message should appear in the chat
   - AI should respond

## Expected Behavior

### Input Field
- ✅ Can type text
- ✅ Placeholder shows: "Ask a question... (⌘K to focus)"
- ✅ Focus ring appears when focused
- ✅ Disabled when loading (opacity 50%)

### Send Button
- ✅ Disabled when input is empty
- ✅ Disabled when loading
- ✅ Shows "..." when loading
- ✅ Shows "Send" when ready
- ✅ Clickable when input has text

### After Sending
- ✅ Message appears in chat
- ✅ Input field clears
- ✅ Typing indicator shows
- ✅ AI response streams in
- ✅ Can send another message

## Keyboard Shortcuts

- `⌘K` or `Ctrl+K` - Focus the input field
- `Enter` - Submit the message
- `Tab` - Navigate between elements

## Common Issues

### Button Still Disabled?
1. Check browser console for errors
2. Make sure you're logged in
3. Try refreshing the page
4. Clear browser cache

### Message Not Sending?
1. Check network tab for API errors
2. Verify authentication token
3. Check rate limits (20 req/min)
4. Look for CORS errors

### No Response from AI?
1. Check backend API is running
2. Verify API_URL in .env.local
3. Check network tab for streaming response
4. Look for timeout errors (30s limit)

## Technical Details

### useCallback Hook
`useCallback` memoizes functions to prevent unnecessary re-renders. However, it requires all dependencies to be listed:

```typescript
useCallback(
  () => {
    // Function body
    // Uses: var1, var2, var3
  },
  [var1, var2, var3] // Must list ALL variables used
);
```

### Why This Matters
- Missing dependencies = stale values
- Stale values = bugs like this
- Complete dependencies = correct behavior

### React Hooks Rules
1. Always include all dependencies
2. Use ESLint plugin: `eslint-plugin-react-hooks`
3. Let the linter warn you about missing deps
4. Don't ignore the warnings!

## Prevention

### ESLint Configuration
Make sure you have this in your ESLint config:

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Code Review Checklist
- [ ] All `useCallback` have complete dependencies
- [ ] All `useEffect` have complete dependencies
- [ ] All `useMemo` have complete dependencies
- [ ] No ESLint warnings ignored
- [ ] Tested in browser

## Status
✅ **FIXED** - Chat input now works correctly with all dependencies included.

## Related Files
- `frontend/app/dashboard/page.tsx` - Main dashboard with chat
- `frontend/lib/hooks.ts` - Custom hooks
- `frontend/components/Toast.tsx` - Toast notifications

---

**Last Updated:** February 8, 2026
**Status:** ✅ Resolved
