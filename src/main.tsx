import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";

// Register Service Worker for PWA with update detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
        
        // Check for updates immediately
        registration.update();
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is ready to activate
              console.log('New version available! Activating...');
              
              // Show update notification
              showUpdateNotification(newWorker);
            }
          });
        });
        
        // Check for updates every 30 minutes
        setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });

    // Listen for controller change (new service worker activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('New service worker activated, reloading page...');
      window.location.reload();
    });
  });
}

// Show update notification to user
function showUpdateNotification(worker: ServiceWorker) {
  // Create a simple notification banner
  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
    color: white;
    padding: 16px;
    text-align: center;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideDown 0.3s ease-out;
  `;
  
  banner.innerHTML = `
    <div style="max-width: 600px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap;">
      <span style="font-weight: 500;">🎉 New version available!</span>
      <button id="update-btn" style="
        background: white;
        color: #FF6B35;
        border: none;
        padding: 8px 20px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s;
      ">Update Now</button>
      <button id="dismiss-btn" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 8px 20px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s;
      ">Later</button>
    </div>
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    #update-btn:hover { transform: scale(1.05); }
    #dismiss-btn:hover { opacity: 0.8; }
  `;
  document.head.appendChild(style);

  document.body.appendChild(banner);

  // Update button handler
  document.getElementById('update-btn')?.addEventListener('click', () => {
    worker.postMessage({ type: 'SKIP_WAITING' });
    banner.remove();
  });

  // Dismiss button handler
  document.getElementById('dismiss-btn')?.addEventListener('click', () => {
    banner.remove();
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </StrictMode>
);
