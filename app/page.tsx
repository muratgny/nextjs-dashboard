import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

//page.tsx is a special Next.js file that exports a React component, and it's required for the route to be accessible. In your application, you already have a page file: /app/page.tsx - this is the home page associated with the route /.

export default function Page() {// export default is to clarify the starting point of the app
  return (
    <main className="flex min-h-screen flex-col p-6"> {/* TailWind Css features applied to main and other sub-elements with classNames*/}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo /> 
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">

        {/* Black triangle with tailwind css */}
        <div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"/>
        
        {/* Black triangle with normal CSS modules */}
        <div className={styles.shape} />

          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>{/* Applying special font to the p tag*/}
            <strong>Welcome to Acme.</strong> This is the example for the{' '}
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Next.js Learn Course
            </a>
            , brought to you by Vercel.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
           {/* Add Hero Images Here */}
            <Image
              src="/hero-desktop.png"
              width={1000}
              height={760}
              className="hidden md:block" //{/* This line ensures to show image on only desktop */}
              alt="Screenshots of the dashboard project showing desktop version"
            />

            <Image
              src="/hero-mobile.png"
              width={560}
              height={620}
              className="block md:hidden" //{/* This line ensures to show image on only desktop */}
              alt="Screenshots of the dashboard project showing mobile version"
            />
        </div>
      </div>
    </main>
  );
}
