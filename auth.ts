import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { Admin } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getAdmin(email: string): Promise<Admin | undefined> {
  try {
    const admin =
      await sql<Admin>`SELECT id, name, email, password FROM administrators WHERE email=${email}`;
    return admin.rows[0];
  } catch (error) {
    console.error('Failed to fetch admin:', error);
    throw new Error('Failed to fetch admin.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);
      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getAdmin(email);
        if (!user) return null;
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) return user;
      }
      console.log('Credenciales invalidas');
      return null;
    },
  }),
  ],
});