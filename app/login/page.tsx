import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />{/* You'll notice the page imports <LoginForm />, which you'll update later in the chapter. This component is wrapped with React <Suspense> because it will access information from the incoming request (URL search params). */}
        </Suspense>
      </div>
    </main>
  );
}

/* NextAuth.js

We will be using NextAuth.js
to add authentication to your application. NextAuth.js abstracts away much of the complexity involved in managing sessions, 
sign-in and sign-out, and other aspects of authentication. While you can manually implement these features, the process can be 
time-consuming and error-prone. NextAuth.js simplifies the process, providing a unified solution for auth in Next.js applications.


*/