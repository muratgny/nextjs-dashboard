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


 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    //Tip: If you're working with forms that have many fields, you may want to consider using the entries() method with JavaScript's Object.fromEntries()
    const { customerId, amount, status } = CreateInvoice.parse({           //the old usage without type validating: const rawFormData = {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

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
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }



  //Since this action is being called in the /dashboard/invoices path, you don't need to call redirect. Calling revalidatePath will trigger a new server request and re-render the table.
  export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  }