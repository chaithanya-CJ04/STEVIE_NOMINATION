# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### ✅ Hydration Mismatch (FIXED)

**Issue:** "Hydration failed because the server rendered HTML didn't match the client"

**Cause:** Components that depend on browser APIs (like `navigator.onLine`) render differently on server vs client.

**Solution:** 
- Added `mounted` state to `OfflineBanner` component
- Component only renders after client-side mount
- Prevents server/client mismatch

```tsx
// ✅ Correct approach
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null; // Don't render on server
```

### ✅ Image Aspect Ratio Warning (FIXED)

**Issue:** "Image has either width or height modified, but not the other"

**Cause:** Using CSS to change image dimensions without maintaining aspect ratio.

**Solution:**
- Added inline `style` prop with `width: 'auto'` or `height: 'auto'`
- Maintains aspect ratio while allowing responsive sizing

```tsx
// ✅ Correct approach
<OptimizedImage
  src="/logo.png"
  width={64}
  height={64}
  style={{ height: '64px', width: 'auto' }}
/>
```

## Other Potential Issues

### 1. Toast Notifications Not Showing

**Symptoms:**
- `showToast()` called but nothing appears
- No errors in console

**Solutions:**
```tsx
// ✅ Make sure you're rendering the toasts
const { toasts, showToast, removeToast } = useToast();

return (
  <>
    {toasts.map((toast) => (
      <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
    ))}
    {/* Your content */}
  </>
);
```

### 2. Keyboard Shortcuts Not Working

**Symptoms:**
- Pressing `⌘K` or `Shift+L` does nothing
- No console errors

**Possible Causes:**
1. Browser extension intercepting shortcuts
2. Component not mounted
3. Input field already focused

**Solutions:**
```tsx
// Check if hook is properly called
useKeyboardShortcut("k", handleFocus, { meta: true });

// Try different key combinations
// macOS: meta (⌘), Windows/Linux: ctrl
```

### 3. Images Not Loading

**Symptoms:**
- Broken image icons
- Loading skeleton never disappears

**Solutions:**

1. **Check file paths:**
```bash
# Images should be in /public folder
ls -la frontend/public/
```

2. **Verify Next.js config:**
```typescript
// next.config.ts should allow image domains
images: {
  domains: ['your-domain.com'],
}
```

3. **Check browser console:**
- Look for 404 errors
- Check network tab for failed requests

### 4. Build Errors

**Issue:** `npm run build` fails

**Common Causes:**

1. **TypeScript errors:**
```bash
# Check for type errors
npx tsc --noEmit
```

2. **Missing dependencies:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

3. **Environment variables:**
```bash
# Make sure .env.local exists
cp .env.example .env.local
# Fill in your actual values
```

### 5. Slow Performance

**Symptoms:**
- App feels sluggish
- High CPU usage
- Slow re-renders

**Solutions:**

1. **Check React DevTools Profiler:**
- Open React DevTools
- Go to Profiler tab
- Record a session
- Look for expensive renders

2. **Verify memoization:**
```tsx
// Make sure expensive components are memoized
const ExpensiveComponent = memo(({ data }) => {
  // Component logic
});
```

3. **Check for unnecessary re-renders:**
```tsx
// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 6. Accessibility Issues

**Issue:** Screen reader not announcing changes

**Solutions:**

1. **Check ARIA live regions:**
```tsx
<div role="log" aria-live="polite">
  {/* Dynamic content */}
</div>
```

2. **Verify ARIA labels:**
```tsx
<button aria-label="Close dialog">
  ×
</button>
```

3. **Test with screen reader:**
- macOS: VoiceOver (⌘ + F5)
- Windows: NVDA (free)
- Chrome: ChromeVox extension

### 7. Mobile Issues

**Issue:** Touch targets too small or UI broken on mobile

**Solutions:**

1. **Check touch target sizes:**
```tsx
// All interactive elements should be min 44x44px
className="min-h-[44px] min-w-[44px]"
```

2. **Test responsive breakpoints:**
```bash
# Open Chrome DevTools
# Toggle device toolbar (⌘ + Shift + M)
# Test different screen sizes
```

3. **Check viewport meta tag:**
```html
<!-- Should be in layout.tsx -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### 8. API Errors

**Issue:** API calls failing or timing out

**Solutions:**

1. **Check rate limits:**
```typescript
// Rate limits are:
// - Chat: 20 requests/minute
// - Chatbot: 15 requests/minute
```

2. **Verify authentication:**
```typescript
// Check if token is valid
const { data } = await supabase.auth.getSession();
console.log('Token:', data.session?.access_token);
```

3. **Check network tab:**
- Open DevTools → Network
- Look for failed requests
- Check request/response headers

### 9. Styling Issues

**Issue:** Styles not applying or looking wrong

**Solutions:**

1. **Check Tailwind classes:**
```bash
# Make sure Tailwind is processing correctly
npm run dev
# Check browser console for CSS errors
```

2. **Verify CSS specificity:**
```tsx
// Use !important sparingly
className="text-red-500 !important"
```

3. **Check for conflicting styles:**
```tsx
// Inline styles override Tailwind
style={{ color: 'red' }} // This wins
className="text-blue-500" // This loses
```

## Debugging Tips

### 1. Enable Verbose Logging

```typescript
// Add to components for debugging
useEffect(() => {
  console.log('Component mounted', { props, state });
}, []);
```

### 2. Use React DevTools

1. Install React DevTools extension
2. Open DevTools → Components tab
3. Inspect component props and state
4. Use Profiler to find performance issues

### 3. Check Browser Console

Always check for:
- Errors (red)
- Warnings (yellow)
- Network failures
- Security warnings

### 4. Test in Incognito Mode

Eliminates issues caused by:
- Browser extensions
- Cached data
- Cookies
- Local storage

### 5. Clear Cache

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# Chrome: ⌘ + Shift + Delete
```

## Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Check browser console for errors
3. ✅ Try in incognito mode
4. ✅ Clear cache and rebuild
5. ✅ Check if issue is reproducible

### When Reporting Issues

Include:
- Error message (full stack trace)
- Steps to reproduce
- Browser and version
- Screenshots if relevant
- What you've already tried

### Useful Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint

# Check for security issues
npm audit

# Build for production
npm run build

# Start production server
npm start

# Clear everything and start fresh
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## Performance Monitoring

### Lighthouse Audit

```bash
# Build production version
npm run build
npm start

# Open Chrome DevTools
# Lighthouse tab → Generate report
```

### Expected Scores
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### React DevTools Profiler

1. Open React DevTools
2. Go to Profiler tab
3. Click record
4. Interact with app
5. Stop recording
6. Analyze flame graph

## Quick Fixes

### App Won't Start
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Build Fails
```bash
npx tsc --noEmit  # Check for type errors
npm run lint      # Check for lint errors
```

### Styles Not Working
```bash
# Check if Tailwind is configured
cat tailwind.config.js
# Restart dev server
```

### Images Not Loading
```bash
# Check if images exist
ls -la public/
# Check Next.js image config
```

---

**Still having issues?** Check the documentation files:
- `UI_IMPROVEMENTS_SUMMARY.md` - Complete list of changes
- `UI_QUICK_REFERENCE.md` - Usage examples
- `SECURITY.md` - Security guidelines
