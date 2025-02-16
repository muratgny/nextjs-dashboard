import '@/app/ui/global.css'; //This is for applying global css feature to the whole app
import { inter } from '@/app/ui/fonts'; //using fonts
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* applying fonts. antialised comes from tailwind css */}
        <body className={`${inter.className} antialiased`}>{children}</body> 
    </html>
  );
}

//This is called a root layout and is required in every Next.js application. Any UI you add to the root layout will be 
// shared across all pages in your application. You can use the root layout to modify your <html> and <body> tags, and add 
// metadata (you'll learn more about metadata in a later chapter).

//Since the new layout you've just created (/app/dashboard/layout.tsx) is unique to the dashboard pages, you don't need 
// to add any UI to the root layout above.

//One benefit of using layouts in Next.js is that on navigation, only the page components update while the layout won't re-render. 
// This is called partial rendering which preserves client-side React state in the layout when transitioning between pages.