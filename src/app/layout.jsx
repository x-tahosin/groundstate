import './globals.css';

export const metadata = {
  title: 'GroundState — Find Green Spaces Near You, Reset in 3 Minutes',
  description: 'GroundState helps developers and remote workers discover nearby peaceful green spaces and provides science-backed guided routines to reduce screen fatigue and mental burnout. Powered by DigitalOcean Serverless AI.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <div className="page-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
