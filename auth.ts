import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);
     
            if (parsedCredentials.success) {
              const { email, password } = parsedCredentials.data;
              const user = await getUser(email);
              if (!user) return null;
              const passwordsMatch = await bcrypt.compare(password, user.password);
     
              if (passwordsMatch) return user;
            }
     
            console.log('Invalid credentials');
            return null;
          },
      }),
  ],
});

//Next, you will need to add the providers option for NextAuth.js. providers is an array where you list different login options such as Google or GitHub. For this course, we will focus on using the Credentials provider only.

//The Credentials provider allows users to log in with a username and a password.

//
/* Files and Their Roles in Authentication
File	        Role
login-form.tsx	Renders the login form and handles form submission.
actions.ts	Contains the authenticate function to call signIn.
auth.ts	Configures NextAuth.js and handles authentication logic.
auth.config.ts	Defines NextAuth.js configuration (e.g., custom login page).
middleware.ts	Protects routes by checking if the user is authenticated.
getUser function	Queries the database to fetch user details.
bcrypt.compare	Compares the entered password with the hashed password in the database. */