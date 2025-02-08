/* 
Streaming works well with React's component model, as each component can be considered a chunk.

There are two ways you implement streaming in Next.js:

    At the page level, with the loading.tsx file (which creates <Suspense> for you).
    At the component level, with <Suspense> for more granular control.



A few things are happening here:

    loading.tsx is a special Next.js file built on top of React Suspense. It allows you to create fallback UI to show as a replacement while page content loads.
    Since <SideNav> is static, it's shown immediately. The user can interact with <SideNav> while the dynamic content is loading.
    The user doesn't have to wait for the page to finish loading before navigating away (this is called interruptable navigation).

Congratulations! You've just implemented streaming. But we can do more to improve the user experience. Let's show a loading skeleton instead of the Loading… text. */
import DashboardSkeleton from '@/app/ui/skeletons';

export default function Loading() { //This loading function will also applied to custormer and invoices pages if it is under dashboard folder. But if we put it under (overview) folder with main page.tsx file under dashboard folder, it only effects main dahboard page. This is called Route Groups.
    return <DashboardSkeleton />;//A loading skeleton is a simplified version of the UI. Many websites use them as a placeholder (or fallback) to indicate to users that the content is loading. Any UI you add in loading.tsx will be embedded as part of the static file, and sent first.
    //return <div>Loading...</div>;
  }


// Route groups allow you to organize files into logical groups without affecting the URL path structure. When you create a new 
// folder using parentheses (), the name won't be included in the URL path. So /dashboard/(overview)/page.tsx becomes /dashboard.