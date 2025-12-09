# Task: Convert DineQR to Progressive Web App (PWA)

## Plan
- [x] Step 1: Create PWA manifest file (manifest.json)
  - [x] Define app metadata (name, description, icons)
  - [x] Configure display mode and theme colors
  - [x] Set up app icons for different sizes
- [x] Step 2: Create and configure service worker
  - [x] Set up caching strategies
  - [x] Implement offline support
  - [x] Add cache management
- [x] Step 3: Update index.html
  - [x] Link manifest file
  - [x] Add meta tags for mobile
  - [x] Add theme color meta tags
- [x] Step 4: Create app icons
  - [x] Generate icons for different sizes
  - [x] Add favicon and apple-touch-icon
- [x] Step 5: Add install prompt component
  - [x] Create InstallPWA component
  - [x] Add install button
  - [x] Handle beforeinstallprompt event
- [x] Step 6: Register service worker in main.tsx
- [x] Step 7: Add PWA utilities and offline indicator
- [x] Step 8: Test PWA functionality
- [x] Step 9: Run lint and verify

## Notes
- PWA requires HTTPS (Supabase provides this)
- Service worker will cache static assets
- Offline support for viewing menus
- Install prompt for adding to home screen
- Push notifications can be added later

## PWA Features Implemented
- ✅ Installable on mobile devices
- ✅ Offline support for static content
- ✅ Fast loading with caching
- ✅ Full-screen experience
- ✅ App-like navigation
- ✅ Offline indicator
- ✅ Install prompt with smart timing
- 🔄 Push notifications (future enhancement)

## Files Created/Modified
- ✅ public/manifest.json
- ✅ public/sw.js
- ✅ public/browserconfig.xml
- ✅ public/icons/* (11 icon files)
- ✅ index.html (updated with PWA meta tags)
- ✅ src/main.tsx (service worker registration)
- ✅ src/App.tsx (added InstallPWA and OfflineIndicator)
- ✅ src/components/common/InstallPWA.tsx
- ✅ src/components/common/OfflineIndicator.tsx
- ✅ src/utils/pwa.ts
- ✅ src/utils/pwaIcons.ts
- ✅ scripts/generate-icons.cjs
