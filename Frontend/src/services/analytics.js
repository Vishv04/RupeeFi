export const initGA = () => {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID; // Read from .env

  if (!gaId) return;

  // Load the GA script
  const script1 = document.createElement("script");
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script1.async = true;
  document.head.appendChild(script1);

  // Initialize GA
  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  `;
  document.head.appendChild(script2);
};
