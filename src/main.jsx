import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if ('serviceWorker' in navigator && 'SyncManager' in window) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js').then((registration) => {
      console.log(' Service Worker registered successfully!', registration);

    });
  });
}


//       // Wait until the service worker is ready before registering sync
//       navigator.serviceWorker.ready.then((reg) => {
//         reg.sync.register('syncMessage').then(() => {
//           console.log(' Background sync "syncMessage" registered!');
//         }).catch((err) => {
//           console.error(' Sync registration failed:', err);
//         });
//       });
//     }).catch((error) => {
//       console.error(' Service Worker registration failed:', error);
//     });
//   });
// }




