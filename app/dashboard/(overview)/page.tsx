
//this page.tsx file is the default index file in nextjs. this file under dashboard folder 
//creates the default route page for /dashboard


import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
//import { fetchCardData } from '@/app/lib/data';//deleted in chapter 9
import { Suspense } from 'react'; //to use streaming a component instead of the whole page
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
 
export default async function Page() {//The page is an async server component. This allows you to use await to fetch data.

  //below we made a waterfall request which means each job waits the before one. To handle it we can use another technic. look lib/data.ts file
  //const latestInvoices = await fetchLatestInvoices();//to fetch data from server.
  //const cardData = await fetchCardData(); //deleted in chapter 9

  //Below is another way to get card data from the function. we used cardData for it
  // const {
  //   numberOfInvoices,
  //   numberOfCustomers,
  //   totalPaidInvoices,
  //   totalPendingInvoices,
  // } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* We delete this part because we use grouping component in chapter 9. We wanted to load all card data at the same time
        
        <Card title="Collected" value={cardData.totalPaidInvoices} type="collected" />
        <Card title="Pending" value={cardData.totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={cardData.numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={cardData.numberOfCustomers}
          type="customers"
        /> */}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}

/* Deciding where to place your Suspense boundaries

Where you place your Suspense boundaries will depend on a few things:

    How you want the user to experience the page as it streams.
    What content you want to prioritize.
    If the components rely on data fetching.

Take a look at your dashboard page, is there anything you would've done differently?

Don't worry. There isn't a right answer.

    You could stream the whole page like we did with loading.tsx... but that may lead to a longer loading time if one of the components has a slow data fetch.
    You could stream every component individually... but that may lead to UI popping into the screen as it becomes ready.
    You could also create a staggered effect by streaming page sections. But you'll need to create wrapper components.

Where you place your suspense boundaries will vary depending on your application. In general, it's good practice to move your data fetches down to the components that need it, and then wrap those components in Suspense. But there is nothing wrong with streaming the sections or the whole page if that's what your application needs.

Don't be afraid to experiment with Suspense and see what works best, it's a powerful API that can help you create more delightful user experiences.*/