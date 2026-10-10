import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* Open Sans 300/400/700 are preloaded via index.html. Secondary families after paint. */
import './globals.css';
import App from './App';
import SmoothScroll from './components/SmoothScroll';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScroll>
      <App />
    </SmoothScroll>
  </StrictMode>,
);

const loadSecondaryFonts = () => {
  void Promise.all([
    import('@fontsource/open-sans/latin-600.css'),
    import('@fontsource/roboto/latin-300.css'),
    import('@fontsource/roboto/latin-400.css'),
    import('@fontsource/roboto/latin-500.css'),
    import('@fontsource/damion/latin-400.css'),
  ]);
};

if (document.readyState === 'complete') {
  loadSecondaryFonts();
} else {
  window.addEventListener('load', loadSecondaryFonts, { once: true });
}
