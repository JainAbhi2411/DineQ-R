# DineQR - Progressive Web App (PWA) Requirements Document

## 1. Application Overview

### 1.1 Application Name
DineQR - Enterprise-Grade Smart Restaurant Management & Customer Engagement Platform (Progressive Web App)

### 1.2 Application Description
A comprehensive, enterprise-level digital restaurant ecosystem delivered as a **Progressive Web App (PWA)** with a cutting-edge futuristic UI that revolutionizes the complete dining experience. The platform provides advanced authentication, real-time notifications with automatic page updates, real-time communication, intelligent order management, and seamless coordination between restaurant owners, staff (waiters/agents), and customers. **The system is delivered as a single Progressive Web App that works seamlessly across all devices (desktop, tablet, mobile) with native app-like capabilities including offline functionality, push notifications, home screen installation, and optimized performance.** Features include multi-level user authentication with role-based conditional homepage/dashboard rendering, dynamic menu management with enhanced database-driven portion selection UI featuring Full Portion as default (original item price) and additional price variants stored in database with custom names and prices, advanced image upload system supporting computer upload, cloud drive integration (Google Drive, Dropbox), and direct URL insertion, AI-powered recommendations, real-time chat system, mandatory waiter assignment for every order by restaurant owner with intelligent free waiter filtering and real-time synchronization to customer dashboard displaying assigned waiter name and information, advanced inventory tracking, integrated payment processing, instant order notifications without page refresh, automatic real-time order timeline updates on both customer and owner dashboards, detailed order tracking with complete timelines, comprehensive e-bill generation system with professional formatting and multiple download options (PDF, print-ready format), personalized restaurant dashboard for quick reordering, complete staff management with attendance tracking, performance analytics, and real-time waiter availability status (Free/Busy/Offline), advanced marketing and promotions system with Swiggy-style real-time customer-facing offers display featuring prominent banner placement, horizontal scrollable offer cards, automatic real-time synchronization via WebSocket, automatic discount application, and promo code redemption, comprehensive settings module for restaurant configuration with automatic currency and timezone application across the entire platform, restaurant type classification (Veg/Non-Veg/Both) with prominent display in browse restaurants and menu pages, QR code scanning functionality available on all mobile devices via PWA camera access, fully functional sidebar navigation with complete features for all menu items including browse restaurants functionality, real-time synchronization of menu updates, table updates, and promotions to customer dashboards without page refresh, Add-On Order feature allowing customers to add items to their active order without creating a new order or bill, and revolutionary NLP-powered Natural Language Ordering via AI Chatbot enabling customers to place orders using conversational text (e.g., 'I want to order 1daal tadka, 4 roti, 1 margherita pizza') with automatic cart creation and intelligent menu item recognition - creating a unified platform that manages every aspect from customer arrival to post-dining feedback, all wrapped in a sleek, modern, futuristic interface with Swiggy-inspired offer presentation. All data displayed across the platform is real-time and dynamically calculated from the live database. **As a PWA, the application provides native app-like experience with offline capabilities, push notifications, home screen installation, fast loading, and works seamlessly across all platforms without requiring separate app store downloads.**

---

## 2. Progressive Web App (PWA) Architecture

### 2.1 PWA Core Features

#### 2.1.1 Installability
- **Add to Home Screen**: Users can install DineQR PWA to their device home screen (iOS, Android, desktop) with a single tap
- **App-Like Experience**: Once installed, PWA launches in standalone mode without browser UI (no address bar, no browser tabs)
- **Custom App Icon**: DineQR branded app icon appears on home screen alongside native apps
- **Splash Screen**: Custom splash screen with DineQR logo and futuristic animation during app launch
- **Installation Prompt**: Smart installation banner appears after user engagement (e.g., after browsing menu, placing order)\n- **Cross-Platform**: Single PWA works on iOS (Safari), Android (Chrome), Windows (Edge), macOS (Safari/Chrome), Linux (Chrome/Firefox)

#### 2.1.2 Offline Functionality
- **Service Worker**: Advanced service worker implementation for offline capabilities and caching strategies
- **Offline Menu Browsing**: View restaurant menu, item details, images, and portions without internet connection (cached data)
- **Offline Order History**: Access past orders, order details, and e-bills offline
- **Offline Favorites**: View saved favorite items and restaurants offline
- **Offline E-Bill Access**: Download and view e-bills offline (stored in IndexedDB)
- **Background Sync**: Queue actions performed offline (e.g., favoriting items, viewing orders) and sync automatically when connection restored
- **Offline Indicator**: Clear visual indicator (banner or toast) when app is in offline mode
- **Cache-First Strategy**: Static assets (CSS, JS, images, fonts) served from cache for instant loading
- **Network-First Strategy**: Dynamic data (menu, orders, promotions) fetched from network with cache fallback
- **Stale-While-Revalidate**: Show cached data immediately while fetching fresh data in background

#### 2.1.3 Push Notifications
- **Web Push API**: Native push notifications via Web Push API (works on Android, Windows, macOS; limited on iOS)
- **Order Status Updates**: Real-time push notifications for order status changes (Accepted, Preparing, Ready, Completed)
- **Waiter Assignment Notifications**: Instant notification when waiter assigned or reassigned to customer's order
- **Promotion Alerts**: Push notifications for new promotions, expiring offers, and personalized deals
- **NLP Order Confirmations**: Notification when NLP chatbot successfully processes order
- **E-Bill Ready Alerts**: Notification when e-bill is generated and ready for download
- **Add-On Order Notifications**: Notification when add-on items added to active order
- **Chat Messages**: Push notifications for new messages from restaurant or waiter
- **Loyalty Rewards**: Notifications for earned loyalty points and available rewards
- **Notification Permissions**: Request notification permissions with clear explanation of benefits
- **Notification Settings**: Granular control over notification types and frequency in app settings
- **iOS Fallback**: For iOS devices (where Web Push is limited), use in-app notifications and WebSocket-based real-time updates

#### 2.1.4 Performance Optimization
- **Fast Loading**: Target< 3 seconds initial load time on3G networks
- **Lazy Loading**: Load images, components, and routes on-demand to reduce initial bundle size
- **Code Splitting**: Split JavaScript bundles by route and feature for faster loading
- **Image Optimization**: Serve responsive images (WebP format with JPEG fallback), lazy load images below the fold
- **Minification & Compression**: Minify CSS/JS, enable Gzip/Brotli compression
- **Critical CSS**: Inline critical CSS for above-the-fold content
- **Preloading**: Preload critical resources (fonts, hero images) for faster rendering
- **Resource Hints**: Use dns-prefetch, preconnect for faster API calls
- **Lighthouse Score**: Target 90+ score on Performance, Accessibility, Best Practices, SEO

#### 2.1.5 Responsive Design
- **Mobile-First Approach**: Design and develop for mobile devices first, then scale up to tablets and desktops
- **Adaptive Layouts**: Layouts adapt seamlessly to different screen sizes (320px to 4K)
- **Touch-Friendly UI**: Large touch targets (minimum 44x44px), swipe gestures, pull-to-refresh
- **Collapsible Sidebar**: Sidebar navigation collapses to hamburger menu on mobile
- **Responsive Typography**: Fluid typography scales based on viewport size
- **Responsive Images**: Serve appropriately sized images based on device resolution and screen size
- **Orientation Support**: Support both portrait and landscape orientations
\n#### 2.1.6 Device Integration
- **Camera Access**: Access device camera for QR code scanning via Web APIs (getUserMedia)
- **Geolocation**: Access device location for nearby restaurant recommendations (with user permission)
- **File System Access**: Access device file system for image uploads (File API)
- **Clipboard Access**: Copy promo codes, order IDs, e-bill links to clipboard
- **Share API**: Native share functionality to share menu items, promotions, e-bills via device share sheet
- **Payment Request API**: Streamlined checkout with Payment Request API (supports Google Pay, Apple Pay, saved cards)
- **Vibration API**: Haptic feedback for button presses and notifications (on supported devices)
- **Screen Wake Lock**: Keep screen awake during order tracking or QR code scanning

---

### 2.2 PWA Technical Implementation

#### 2.2.1 Service Worker Strategy
- **Registration**: Register service worker on app load, handle updates gracefully
- **Caching Strategies**:
  - **Cache-First**: Static assets (CSS, JS, fonts, images)\n  - **Network-First**: Dynamic data (menu, orders, promotions) with cache fallback
  - **Stale-While-Revalidate**: User profile, settings, order history
  - **Network-Only**: Payment processing, authentication\n- **Cache Management**: Implement cache versioning, automatic cache cleanup for old versions
- **Background Sync**: Queue failed API requests (e.g., order placement, favorite item) and retry when connection restored
- **Periodic Background Sync**: Fetch fresh menu data, promotions in background (when app is closed)
- **Update Strategy**: Prompt user to refresh when new version available, skip waiting for critical updates

#### 2.2.2 Manifest Configuration
- **Web App Manifest**: Comprehensive manifest.json with app metadata\n- **App Name**: 'DineQR - Smart Restaurant Manager' (for owners/waiters), 'DineQR - Order & Dine' (for customers)
- **Short Name**: 'DineQR'\n- **Description**: 'Enterprise-grade smart restaurant management and customer engagement platform'
- **Icons**: Multiple icon sizes (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512) in PNG format
- **Start URL**: '/' with query parameter to track PWA installs
- **Display Mode**: 'standalone' (app-like experience without browser UI)
- **Orientation**: 'portrait-primary' (default), support 'landscape' for tablets
- **Theme Color**: Deep charcoal grey (#1a1a2e) to match futuristic dark theme
- **Background Color**: Deep charcoal grey (#1a1a2e) for splash screen
- **Scope**: '/' to define navigation scope\n- **Categories**: ['food', 'business', 'productivity']
\n#### 2.2.3Offline Data Storage
- **IndexedDB**: Store large datasets (menu items, order history, e-bills, images) for offline access
- **LocalStorage**: Store small data (user preferences, settings, auth tokens)
- **Cache API**: Store static assets and API responses via service worker
- **Data Sync**: Sync offline data with server when connection restored, handle conflicts gracefully
- **Storage Quota**: Monitor storage usage, request persistent storage for critical data

#### 2.2.4 Push Notification Implementation
- **Subscription**: Request notification permissions, subscribe to push notifications via Push API
- **Server Integration**: Send push notifications from backend via Web Push protocol (VAPID keys)
- **Notification Payload**: Include title, body, icon, badge, actions (e.g., 'View Order', 'Dismiss')
- **Notification Click Handling**: Open relevant page when notification clicked (e.g., order details page)
- **iOS Fallback**: For iOS devices, use WebSocket-based real-time updates and in-app notifications (banner/toast)
\n---

### 2.3 PWA User Experience

#### 2.3.1 Installation Flow
1. **First Visit**: User visits DineQR PWA via browser (https://dineqr.com)\n2. **Browse & Engage**: User browses menu, places order, or views promotions
3. **Installation Prompt**: After engagement, browser shows'Add to Home Screen' prompt (or custom in-app prompt)
4. **Install**: User taps 'Add' → PWA installed to home screen
5. **Launch**: User taps DineQR icon on home screen → PWA launches in standalone mode (no browser UI)
6. **Splash Screen**: Custom splash screen with DineQR logo appears during launch
7. **App Experience**: User experiences native app-like interface with offline capabilities and push notifications

#### 2.3.2 Offline Experience
1. **Connection Lost**: User loses internet connection (airplane mode, poor network)
2. **Offline Indicator**: Banner appears at top: 'You are offline. Some features may be limited.'
3. **Cached Content**: User can still browse cached menu, view order history, access e-bills
4. **Offline Actions**: User favorites an item → Action queued for background sync
5. **Connection Restored**: Banner updates: 'You are back online!' → Queued actions sync automatically
6. **Fresh Data**: App fetches fresh data in background, updates UI seamlessly

#### 2.3.3 Push Notification Experience
1. **Permission Request**: After first order, app requests notification permissions with clear explanation
2. **User Grants Permission**: User taps 'Allow' → Subscribed to push notifications
3. **Order Update**: Restaurant updates order status to 'Preparing'\n4. **Push Notification**: User receives push notification: 'Your order #1234 is being prepared!'
5. **Notification Click**: User taps notification → PWA opens to order tracking page
6. **Real-Time Updates**: Order timeline updates in real-time via WebSocket

---

## 3. User Roles & Dashboards (PWA)

### 3.1 Customer Dashboard (PWA)

**Home Screen**:\n- **Top Navigation**: DineQR logo, search bar, NLP chatbot icon, notification bell, profile icon
- **Swiggy-Style Promotions Carousel**: Horizontal scrollable promotion cards with real-time updates
- **NLP Quick Order Section**: 'Order with AI' button, example queries\n- **Active Orders Section**: Display active orders with waiter info, promotion badges, order source indicators,'Download E-Bill' button for completed orders
- **Recently Scanned Restaurants**: Thumbnail grid with'View Menu' buttons
- **Recommended Items**: Personalized item recommendations with promotion badges
- **Bottom Navigation Bar** (Mobile) or **Sidebar** (Desktop): Home, Browse, Offers, Orders, Profile
- **Install Prompt** (if not installed): 'Install DineQR for faster access and offline features' with 'Install' button

**QR Code Scanning** (Mobile PWA):
1. Tap 'Scan QR Code' button (floating action button)
2. PWA requests camera permission → User grants permission
3. Camera opens with QR code scanner overlay (using getUserMedia API and QR code library)
4. Scan restaurant table QR code → Table number auto-detected
5. Navigate to restaurant menu page
\n**Menu Browsing**:
- **Menu Header**: Restaurant name, restaurant type badge, NLP chatbot floating button
- **Swiggy-Style Promotions Banner**: Horizontal scrollable offer cards\n- **Category Navigation**: Horizontal tabs for menu categories
- **Menu Items Grid**: Item cards with primary image (lazy loaded), name, price, portion options, promotion badges
- **Item Details**: Tap item card → Full-screen modal with image carousel, description, portion selection, quantity selector, 'Add to Cart' button
- **NLP Ordering**: Tap NLP chatbot button → Full-screen chatbot modal, type order in natural language, chatbot processes and displays order summary, tap 'Add to Cart'\n\n**Cart & Checkout**:
1. Review cart → Edit quantities/portions, apply promotions (Swiggy-style promo code section)
2. Proceed to checkout → Enter customer details, select order type, review order summary
3. Payment → Select payment method (Payment Request API for Google Pay/Apple Pay, Card, UPI, Cash), complete payment
4. Order confirmation → View order details, waiter assignment status, 'Download E-Bill' button\n
**Order Tracking**:
- **Order Tracking Page**: Order ID, order source badge, applied promotion section, assigned waiter info section (with real-time updates via WebSocket), order details, order timeline, e-bill download section
- **Real-Time Updates**: Push notifications (if enabled) or in-app notifications for status changes, waiter assignments, e-bill ready\n- **Chat with Waiter**: Tap 'Chat with Waiter' button → Real-time chat interface (WebSocket)\n\n**Order History & E-Bills**:
- **Order History**: List of past orders with search/filter options (cached for offline access)
- **Order Details**: Tap order → View full order details, waiter info, promotion details, order source\n- **E-Bill Download**: Tap 'Download E-Bill' → Download PDF to device (stored in IndexedDB for offline access), view in app, print, share via Share API, email\n\n**Offers & Promotions**:
- **Offers Page**: Grid of promotion cards with real-time updates (WebSocket), search/filter options
- **Promotion Details**: Tap card → Full-screen modal with discount details, promo code, eligibility, validity, terms & conditions
- **Apply Offer**: Tap 'Apply Offer' → System validates and applies to cart\n\n**Profile & Settings**:
- **Profile**: View/edit profile info, change password\n- **Settings**: Notification preferences (push notifications toggle), language, theme (light/dark/auto), privacy settings
- **Install PWA** (if not installed): 'Install DineQR App' button with instructions
- **Logout**: Tap logout → Confirm → Return to login screen

---

### 3.2 Owner Dashboard (PWA)

**Dashboard**:
- **Top Metrics Cards**: Today's revenue, active orders, total orders, customer satisfaction, active promotions, NLP orders (real-time data)
- **Recent Orders Section**: Last 5 orders with waiter assignment info, promotion badges, order source indicators, 'View E-Bill' button
- **Quick Actions Grid**: Add Menu Item, Create Promotion, Generate QR Code, View Analytics, Manage Staff, Settings
- **Active Promotions Section**: Display currently active promotions with quick view cards
\n**Menu Management**:
- **Menu Items List**: Grid/list view with search/filter options
- **Add/Edit Menu Item**: Multi-tab form (Basic Info, Image Upload, Pricing & Portions, Inventory, Additional Details, Promotions, NLP Aliases)
- **Image Upload**: \n  - **Computer Upload**: File input with drag-and-drop support (File API)
  - **Cloud Drive Import**: Integrate with Google Drive Picker API, Dropbox Chooser API
  - **Direct URL**: Input field for image URL
  - **Image Preview**: Show preview before upload, crop/resize options
- **Real-Time Sync**: Menu changes sync to customer PWAs instantly via WebSocket
\n**Order Management**:
- **Order Dashboard**: Order cards grid with filters (Unassigned, Orders with Promotions, NLP Orders)\n- **Order Details**: Full-screen modal with order summary, items, timeline, payment info, waiter assignment section, promotion details, order source,'Download E-Bill' button\n- **Assign Waiter**: Tap 'Assign Waiter' → Modal displays only free waiters, select waiter, confirm assignment
- **Real-Time Updates**: Push notifications (if enabled) or in-app notifications for new orders, promotion applications, NLP orders, e-bill generation

**Promotions Management**:
- **Marketing Dashboard**: Active promotions, scheduled promotions, expired promotions\n- **Create Promotion**: Multi-step form (Basic Info, Discount Details, Eligibility, Validity, Preview)\n- **Real-Time Sync**: Promotion changes sync to customer PWAs instantly via WebSocket
\n**Staff Management**:
- **Free Waiters Section**: Display free waiters with avatar, name, workload, 'Assign to Order' button
- **All Staff Section**: List of all staff with filters (All, Waiters, Free, Busy, Offline)
- **Add/Edit Staff**: Form with name, role, contact info, workload threshold\n\n**E-Bill Management**:
- **E-Bill Settings**: Configure branding, layout, content, footer, download format, auto-generate, email/SMS delivery
- **View E-Bills**: Access e-bills for all orders, download, print, share via Share API, regenerate\n- **Bulk Download**: Select multiple orders, download e-bills as ZIP file

**Analytics**:
- **Analytics Dashboard**: Revenue trends, order analytics, menu performance, customer analytics, staff analytics, promotion analytics, NLP analytics, e-bill analytics
- **Custom Reports**: Generate and export reports as PDF/CSV
\n**Settings**:
- **Restaurant Profile**: Edit restaurant info, restaurant type, currency, timezone
- **Operational Settings**: Configure order settings, payment settings, notification settings
- **Waiter Assignment Settings**: Enable auto-assignment, set workload threshold\n- **Promotion Settings**: Enable promotions, configure stacking, auto-apply\n- **NLP Settings**: Enable NLP ordering, configure recognition threshold, customize messages
- **E-Bill Settings**: Configure branding, layout, content, download format\n- **Image Upload Settings**: Configure max file size, compression, cloud drive integrations

---

### 3.3 Waiter Dashboard (PWA)

**Dashboard**:
- **Metrics Cards**: Orders assigned today, orders with promotions, NLP orders\n- **Assigned Orders Section**: Display only orders assigned to this waiter with order details, promotion badges, order source indicators, 'View E-Bill' button
- **Clock In/Out**: Tap button to clock in/out, status changes to Free/Offline
\n**Order Management**:
- **Order Details**: Full-screen modal with order summary, items, timeline, waiter assignment info, promotion details, order source, 'View E-Bill' button
- **Update Status**: Tap status button → Select new status (Accept, Preparing, Ready, Completed)\n- **Chat with Customer**: Tap 'Chat with Customer' → Real-time chat interface (WebSocket)
\n**E-Bill Access**:
- **View E-Bill**: Tap 'View E-Bill' button → Full-screen e-bill view, download, print, share via Share API\n- **Share with Customer**: Tap 'Share E-Bill with Customer' → Send e-bill link via Share API (SMS, email, WhatsApp)
\n**Profile & Attendance**:
- **Profile**: View/edit profile info, performance metrics (orders handled, ratings, availability rate)
- **Attendance**: View attendance history, clock in/out logs\n\n---

## 4. PWA-Specific Features

### 4.1 Installation & Onboarding

#### 4.1.1 Installation Prompt
- **Trigger**: Show installation prompt after user engagement (e.g., after browsing menu, placing order, viewing3+ pages)
- **Custom Prompt**: Custom in-app banner with DineQR branding: 'Install DineQR for faster access, offline features, and push notifications' with 'Install' and 'Not Now' buttons
- **Browser Prompt**: Trigger native browser 'Add to Home Screen' prompt when user taps 'Install'
- **Defer Prompt**: If user taps 'Not Now', defer prompt and show again after 7 days or after next order
- **Installation Success**: Show success message: 'DineQR installed! You can now access it from your home screen.'

#### 4.1.2 Onboarding (First Launch)
1. **Splash Screen**: Custom splash screen with DineQR logo and futuristic animation (2-3 seconds)
2. **Welcome Screen**: 'Welcome to DineQR!' with brief description and 'Get Started' button
3. **Feature Highlights**: Swipeable carousel highlighting key features (QR Scanning, NLP Ordering, Promotions, E-Bills, Offline Access)
4. **Permission Requests**: \n   - **Notifications**: 'Enable notifications to get real-time order updates' with 'Enable' and 'Skip' buttons
   - **Camera** (if customer): 'Allow camera access to scan QR codes' with 'Allow' and 'Skip' buttons
   - **Location** (optional): 'Allow location access to find nearby restaurants' with 'Allow' and 'Skip' buttons
5. **Sign Up/Login**: Navigate to authentication screen
\n---

### 4.2 Offline Features

#### 4.2.1 Offline Menu Browsing
- **Cache Strategy**: Cache menu data (items, images, portions, promotions) when user visits restaurant menu page
- **Offline Access**: When offline, user can browse cached menu, view item details, see portions and prices\n- **Offline Indicator**: Banner at top: 'You are offline. Viewing cached menu. Some features may be unavailable.'
- **Limitations**: Cannot add to cart, place order, or see real-time promotions when offline
- **Sync on Reconnect**: When connection restored, fetch fresh menu data in background, update UI if changes detected

#### 4.2.2 Offline Order History
- **Cache Strategy**: Cache order history data (orders, items, waiter info, e-bills) when user views order history page
- **Offline Access**: When offline, user can view cached order history, order details, and downloaded e-bills
- **Offline E-Bills**: E-bills stored in IndexedDB, accessible offline for viewing and printing
- **Sync on Reconnect**: When connection restored, fetch fresh order data in background, update UI if changes detected

#### 4.2.3 Background Sync
- **Queue Actions**: When offline, queue actions like favoriting items, viewing orders, updating profile
- **Sync on Reconnect**: When connection restored, service worker automatically syncs queued actions with server
- **Conflict Resolution**: If conflicts detected (e.g., item removed from menu), show notification to user

---
\n### 4.3 Push Notifications

#### 4.3.1 Notification Types
- **Order Status Updates**: 'Your order #1234 is being prepared!' (with'View Order' action)
- **Waiter Assignment**: 'John has been assigned to your order #1234' (with 'View Order' action)
- **Promotion Alerts**: 'New offer: 20% off on all pizzas!' (with 'View Offer' action)
- **NLP Order Confirmation**: 'Your AI order has been added to cart!' (with 'View Cart' action)
- **E-Bill Ready**: 'Your e-bill for order #1234 is ready!' (with 'Download E-Bill' action)
- **Add-On Order**: '2 items added to your active order #1234' (with 'View Order' action)
- **Chat Messages**: 'New message from John (Waiter)' (with 'Open Chat' action)
- **Loyalty Rewards**: 'You earned 50 points! Redeem now.' (with 'View Rewards' action)

#### 4.3.2 Notification Handling
- **Click Action**: When user clicks notification, PWA opens to relevant page (order details, offer page, chat, etc.)
- **Action Buttons**: Notifications include action buttons (e.g., 'View Order', 'Dismiss')
- **Badge Count**: Update PWA badge count (on app icon) with unread notifications count
- **Notification History**: Store notification history in app, accessible from notification bell icon

#### 4.3.3 iOS Fallback
- **Web Push Limitation**: iOS Safari has limited Web Push support (requires iOS 16.4+, only works when PWA installed)
- **Fallback Strategy**: For iOS users, use WebSocket-based real-time updates and in-app notifications (banner/toast)
- **In-App Notifications**: Show banner at top of screen for order updates, waiter assignments, promotions\n- **Notification Bell**: Notification bell icon shows unread count, taps opens notification history

---
\n### 4.4 Device Integration

#### 4.4.1 Camera Access (QR Scanning)
- **Permission Request**: Request camera permission when user taps 'Scan QR Code' button
- **Camera UI**: Full-screen camera view with QR code scanner overlay,'Cancel' button\n- **QR Detection**: Use QR code detection library (e.g., jsQR, qr-scanner) to detect QR codes in camera feed
- **Auto-Scan**: Automatically detect and process QR code when in view
- **Fallback**: If camera access denied, show 'Upload QR Code Image' option (File API)

#### 4.4.2 Share API
- **Share Menu Items**: Tap 'Share' button on item details page → Native share sheet opens → Share item name, image, link via SMS, email, WhatsApp, etc.
- **Share Promotions**: Tap 'Share' button on promotion card → Share promotion details and promo code
- **Share E-Bills**: Tap 'Share E-Bill' button → Share e-bill PDF or link
- **Share Restaurant**: Tap 'Share' button on restaurant page → Share restaurant name, menu link\n
#### 4.4.3 Payment Request API
- **Streamlined Checkout**: Use Payment Request API for fast checkout with saved payment methods
- **Supported Methods**: Google Pay, Apple Pay (on iOS), saved credit/debit cards\n- **Autofill**: Automatically fill shipping/billing address, contact info from browser autofill
- **Fallback**: If Payment Request API not supported, show traditional payment form

#### 4.4.4 Clipboard API
- **Copy Promo Codes**: Tap 'Copy Code' button on promotion card → Promo code copied to clipboard, show toast: 'Promo code copied!'
- **Copy Order ID**: Tap 'Copy Order ID' button on order details page → Order ID copied to clipboard\n- **Copy E-Bill Link**: Tap 'Copy Link' button on e-bill page → E-bill link copied to clipboard

#### 4.4.5 Geolocation API
- **Nearby Restaurants**: Request location permission → Fetch user's location → Show nearby restaurants on browse page
- **Distance Display**: Show distance from user's location to each restaurant
- **Optional**: Location permission is optional, users can browse all restaurants without granting permission

---
\n## 5. Technical Stack (PWA)

### 5.1 Frontend Technologies
- **Framework**: React.js 18+ with Next.js 14+ (for SSR, SSG, and optimized PWA support)
- **UI Library**: Tailwind CSS for styling, Framer Motion for animations
- **State Management**: Redux Toolkit or Zustand for global state\n- **PWA Framework**: next-pwa plugin for Next.js (service worker generation, manifest configuration)
- **Service Worker**: Workbox for advanced caching strategies and background sync
- **Push Notifications**: Web Push API with VAPID keys\n- **QR Code Scanning**: jsQR or qr-scanner library with getUserMedia API
- **Image Optimization**: Next.js Image component with WebP format, lazy loading\n- **Offline Storage**: IndexedDB (via idb library) for large datasets, LocalStorage for small data
- **Real-Time Communication**: Socket.io client for WebSocket connections
- **Payment Integration**: Payment Request API, Stripe.js, Razorpay SDK
- **PDF Generation**: jsPDF or PDFKit for e-bill generation
- **Cloud Drive Integration**: Google Drive Picker API, Dropbox Chooser API
- **NLP Integration**: Axios for API calls to NLP backend
\n### 5.2 Backend Technologies
- **Server**: Node.js with Express.js or Django\n- **Database**: PostgreSQL or MongoDB
- **Authentication**: JWT tokens with refresh token mechanism, OAuth 2.0 (Google, Apple)
- **WebSocket**: Socket.io server for real-time updates
- **Push Notifications**: Web Push library (web-push npm package) with VAPID keys
- **Payment Gateway**: Stripe, Razorpay, PayPal APIs
- **Cloud Storage**: AWS S3, Google Cloud Storage, or Cloudinary for image storage
- **Email Service**: SendGrid, Mailgun, or AWS SES\n- **SMS Service**: Twilio or AWS SNS
- **NLP Engine**: Python with spaCy, NLTK, or Hugging Face Transformers
- **Image Processing**: Sharp or Jimp for image compression and resizing
\n### 5.3 Hosting & Deployment
- **Frontend Hosting**: Vercel (optimized for Next.js PWAs), Netlify, or AWS Amplify
- **Backend Hosting**: AWS EC2, Google Cloud Run, or Heroku\n- **Database Hosting**: AWS RDS (PostgreSQL), MongoDB Atlas\n- **CDN**: Cloudflare or AWS CloudFront for static asset delivery
- **SSL Certificate**: Let's Encrypt or AWS Certificate Manager (HTTPS required for PWA)
- **Domain**: https://dineqr.com\n
---

## 6. PWA Compliance & Best Practices

### 6.1 PWA Checklist
-✅ **HTTPS**: Serve app over HTTPS (required for service workers and PWA features)
- ✅ **Service Worker**: Register service worker for offline functionality and caching
- ✅ **Web App Manifest**: Include manifest.json with app metadata, icons, theme colors
- ✅ **Installable**: App meets installability criteria (HTTPS, manifest, service worker, engagement heuristics)
- ✅ **Responsive Design**: App works on all screen sizes (mobile, tablet, desktop)
- ✅ **Fast Loading**: Initial load < 3 seconds on3G networks
- ✅ **Offline Functionality**: Core features work offline (menu browsing, order history, e-bills)
- ✅ **Push Notifications**: Implement Web Push API for real-time notifications
- ✅ **App-Like Experience**: Standalone display mode, no browser UI
- ✅ **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support\n- ✅ **SEO**: Meta tags, structured data, sitemap, robots.txt
- ✅ **Performance**: Lighthouse score90+ on Performance, Accessibility, Best Practices, SEO

### 6.2 Lighthouse Optimization
- **Performance**: \n  - Minimize JavaScript bundle size (code splitting, tree shaking)
  - Optimize images (WebP format, responsive images, lazy loading)
  - Enable compression (Gzip/Brotli)
  - Use CDN for static assets
  - Implement caching strategies (service worker)\n- **Accessibility**: 
  - Semantic HTML (headings, landmarks, lists)
  - ARIA labels for interactive elements
  - Keyboard navigation support
  - Color contrast ratio4.5:1 minimum
  - Focus indicators for interactive elements
- **Best Practices**: 
  - HTTPS only\n  - No console errors
  - Secure authentication (JWT, OAuth)
  - Content Security Policy (CSP) headers
- **SEO**: 
  - Meta tags (title, description, Open Graph, Twitter Card)
  - Structured data (JSON-LD for restaurants, menu items)
  - Sitemap.xml and robots.txt
  - Canonical URLs
\n---

## 7. User Flows (PWA)

### 7.1 Customer Flow
\n1. **First Visit**: User visits https://dineqr.com via mobile browser
2. **Browse**: User browses menu, views promotions\n3. **Installation Prompt**: After engagement, custom banner appears: 'Install DineQR for faster access and offline features'
4. **Install**: User taps 'Install' → Browser shows'Add to Home Screen' prompt → User confirms
5. **Launch**: User taps DineQR icon on home screen → PWA launches in standalone mode
6. **Onboarding**: Welcome screen, feature highlights, permission requests (notifications, camera)\n7. **Sign Up/Login**: User creates account or logs in
8. **QR Scanning**: User taps 'Scan QR Code' → Camera opens → Scans table QR code → Navigates to menu
9. **Menu Browsing**: User browses menu, views items, portions, promotions
10. **NLP Ordering** (optional): User taps NLP chatbot → Types order in natural language → Chatbot processes and adds to cart
11. **Checkout**: User reviews cart, applies promotions, enters details, selects payment method (Payment Request API for Google Pay/Apple Pay)
12. **Order Confirmation**: User views order details, waiter assignment status
13. **Order Tracking**: User receives push notifications for status updates, views order timeline, chats with waiter
14. **E-Bill Download**: When order completed, user taps 'Download E-Bill' → E-bill downloaded to device (stored in IndexedDB)
15. **Offline Access**: User goes offline → Can still view cached menu, order history, downloaded e-bills
16. **Reorder**: User views order history → Taps 'Reorder' → Items added to cart
\n### 7.2 Owner Flow

1. **Login**: Owner visits https://dineqr.com/owner via browser or installed PWA
2. **Dashboard**: Owner views metrics, recent orders, quick actions
3. **Menu Management**: Owner adds/edits menu items with image upload (computer, cloud drive, URL), portions, NLP aliases
4. **Order Management**: Owner views orders, assigns waiters (from free waiters list), tracks orders
5. **Promotions Management**: Owner creates/edits promotions, real-time sync to customer PWAs
6. **Staff Management**: Owner manages waiters, views free waiters, tracks availability
7. **E-Bill Management**: Owner configures e-bill settings, views/downloads e-bills
8. **Analytics**: Owner views revenue, order, menu, staff, promotion, NLP, e-bill analytics
9. **Settings**: Owner configures restaurant profile, operational settings, waiter assignment, promotions, NLP, e-bills
10. **Push Notifications**: Owner receives push notifications for new orders, promotion applications, NLP orders
\n### 7.3 Waiter Flow

1. **Login**: Waiter visits https://dineqr.com/waiter via browser or installed PWA
2. **Clock In**: Waiter taps 'Clock In' → Status changes to Free\n3. **Dashboard**: Waiter views assigned orders, metrics\n4. **Order Management**: Waiter views order details, updates status (Accept, Preparing, Ready, Completed)
5. **Chat with Customer**: Waiter taps 'Chat with Customer' → Real-time chat interface\n6. **E-Bill Access**: Waiter views e-bill, shares with customer via Share API
7. **Clock Out**: Waiter taps 'Clock Out' → Status changes to Offline
8. **Push Notifications**: Waiter receives push notifications for new assigned orders, customer messages

---

## 8. Design Style (PWA)

**Overall Aesthetic**: Dark-themed futuristic interface with neon accents (electric cyan #00d9ff, vibrant magenta #ff006e, electric blue #3a86ff, neon purple #8338ec), glassmorphism effects, smooth gradients, multi-layered UI, subtle shadows, and 3D effects. **PWA design is optimized for touch interactions, responsive layouts, and fast loading.**

**Typography**: \n- **Headings**: Orbitron Bold or Exo 2 Bold (futuristic, tech-inspired)
- **Body Text**: Poppins Regular or Inter Regular (clean, readable)
- **Font Loading**: Use font-display: swap for faster initial render, preload critical fonts
\n**Color Palette**: 
- **Background**: Deep charcoal grey (#1a1a2e) or dark blue (#0f0f1e)
- **Accents**: Electric cyan (#00d9ff), vibrant magenta (#ff006e), electric blue (#3a86ff), neon purple (#8338ec)
- **Status Colors**: Neon green (#39ff14) for success, neon yellow (#ffea00) for warning, neon red (#ff073a) for error
- **Text**: White (#ffffff) or light grey (#e0e0e0)
\n**UI Components**: 
- **Cards**: Glassmorphism cards with neon gradient borders (2px), backdrop blur, subtle shadows
- **Buttons**: Futuristic buttons with neon gradients, hover effects (glow, scale), active states (press animation)
- **Inputs**: Dark input fields with neon borders on focus, floating labels\n- **Modals**: Full-screen modals with slide-up animation, glassmorphism background
- **Navigation**: Bottom navigation bar (mobile) with neon active state, sidebar (desktop) with collapsible sections
- **Notifications**: Toast notifications with neon borders, slide-in animation
\n**Animations**: 
- **Page Transitions**: Fade-in, slide-in animations for page navigation
- **Loading**: Pulsing glow animation for loading states, skeleton screens for content loading
- **Interactions**: Ripple effect on button press, shake animation for errors, scale animation on hover
- **Real-Time Updates**: Smooth fade-in animation for new orders, promotions, notifications

**Responsive Design**: 
- **Mobile-First**: Design for mobile (320px+) first, scale up to tablet (768px+) and desktop (1024px+)
- **Breakpoints**: 320px (small mobile), 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop)
- **Touch Targets**: Minimum 44x44px for touch targets (buttons, links, icons)
- **Gestures**: Swipe gestures for navigation (swipe left/right for tabs, swipe down for refresh)

**Accessibility**: 
- **Color Contrast**: Minimum 4.5:1 contrast ratio for text, 3:1 for large text and UI components
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Escape, Arrow keys)
- **Screen Reader**: ARIA labels, semantic HTML, focus management
- **Focus Indicators**: Visible focus indicators (neon outline) for interactive elements
\n---

## 9. Future Enhancements (PWA)

- **Advanced Offline Mode**: Full offline ordering with queue and sync when connection restored
- **Voice Ordering**: Voice commands for ordering via Web Speech API
- **Augmented Reality Menu**: AR view of menu items using WebXR API (experimental)
- **Wearable Support**: Smartwatch notifications via Web Bluetooth API (experimental)
- **Multi-Language Support**: Support for multiple languages with i18n
- **Advanced Analytics**: Detailed analytics dashboard with AI-powered insights
- **Integration with Delivery Platforms**: Integrate with Uber Eats, DoorDash, Swiggy, Zomato
- **Table Reservation System**: Book tables via PWA\n- **Kitchen Display System (KDS)**: Dedicated KDS PWA for kitchen staff
- **Customer Feedback Analysis**: AI-powered sentiment analysis of customer feedback
- **Gamification**: Loyalty points, badges, leaderboards
- **AI-Powered Waiter Assignment**: Machine learning algorithm for optimal waiter assignment
- **Dynamic Pricing with Promotions**: AI adjusts promotion values in real-time
- **Advanced NLP Features**: Contextual understanding, multi-turn conversations, sentiment analysis
- **Advanced E-Bill Features**: Multiple templates, multi-language e-bills, digital signatures
- **Advanced Image Upload Features**: AI-powered image tagging, quality analysis, background removal
- **Progressive Enhancement**: Gradually enhance PWA with new Web APIs as they become available (Web Bluetooth, WebXR, Web NFC, etc.)

---\n
**End of Requirements Document**