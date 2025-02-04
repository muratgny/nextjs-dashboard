'use client'; //to use usePathname hook from React library

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link'; //to use Link feature of nextjs instead of <a> tag
import { usePathname } from 'next/navigation'; //to get current rout and see active link
import clsx from 'clsx'; //to use conditional CSS library

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {

  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          //In Next.js, you can use the <Link /> Component to link between pages in your application. <Link> allows you to 
          // do client-side navigation with JavaScript. with it, be able to navigate between the pages without seeing a full refresh
          <Link
            key={link.name}
            href={link.href} 
            className={clsx( // using clsx library to apply conditional css 
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href, 
              },
            )}   
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

/*
Automatic code-splitting and prefetching

To improve the navigation experience, Next.js automatically code splits your application by route segments. This is different 
from a traditional React SPA

, where the browser loads all your application code on the initial page load.

Splitting code by routes means that pages become isolated. If a certain page throws an error, the rest of the application 
will still work. This is also less code for the browser to parse, which makes your application faster.

Furthermore, in production, whenever <Link> components appear in the browser's viewport, Next.js automatically prefetches 
the code for the linked route in the background. By the time the user clicks the link, the code for the destination page will 
already be loaded in the background, and this is what makes the page transition near-instant!
*/ 
