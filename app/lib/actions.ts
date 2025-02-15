/*
By adding the 'use server', you mark all the exported functions within the file as Server Actions. These server functions can 
then be imported and used in Client and Server components. Any functions included in this file that are not used will be 
automatically removed from the final application bundle.

You can also write Server Actions directly inside Server Components by adding "use server" inside the action. But for this 
course, we'll keep them all organized in a separate file. We recommend having a separate file for your actions.
*/
'use server';

import { z } from 'zod'; //this zod library is a typescript validation library.
import { revalidatePath } from 'next/cache';//Next.js has a client-side router cache that stores the route segments in the user's browser for a time. Along with prefetching, this cache ensures that users can quickly navigate between routes while reducing the number of requests made to the server.
//Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. 
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth'; //used for authentication
import { AuthError } from 'next-auth';//used for authentication

 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

//Using Zod here. 
//
// customerId - Zod already throws an error if the customer field is empty as it expects a type string. But let's add a friendly message if the user doesn't select a customer.
// amount - Since you are coercing the amount type from string to number, it'll default to zero if the string is empty. Let's tell Zod we always want the amount greater than 0 with the .gt() function.
// status - Zod already throws an error if the status field is empty as it expects "pending" or "paid". Let's also add a friendly message if the user doesn't select a status.

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.',
    }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {//prevState: contains the state passed from the useActionState hook. You won't be using it in the action in this example, but it's a required prop.
  

    //Tip: If you're working with forms that have many fields, you may want to consider using the entries() method with JavaScript's Object.fromEntries()
    // const { customerId, amount, status } = CreateInvoice.parse({           //the old usage without type validating: const rawFormData = {
    //     customerId: formData.get('customerId'),
    //     amount: formData.get('amount'),
    //     status: formData.get('status'),
    //   });

    // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    }
    catch(error) {
      // We'll log the error to the console for now
      console.error(error);
    }

  revalidatePath('/dashboard/invoices');//Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.
  redirect('/dashboard/invoices');
  
        // Test it out:
      //console.log(typeof rawFormData.amount);
}


// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    try{
        await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
    } catch (error) {
      // We'll log the error to the console for now
      console.error(error);
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }



  //Since this action is being called in the /dashboard/invoices path, you don't need to call redirect. Calling revalidatePath will trigger a new server request and re-render the table.
  export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  }



  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }