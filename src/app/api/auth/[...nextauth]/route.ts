import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await User.findOne({
            $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
          }).select('+password');

          if (!user) {
            throw new Error('No user found with this email or username.');
          }

          const isPasswordCorrect = await user.matchPassword(credentials.password);

          if (!isPasswordCorrect) {
            throw new Error('Incorrect password.');
          }
          
          return user;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Use user.id if _id is not present
        token.id = (user as any)._id?.toString() || user.id;
        token.username = user.username;
        token.fullName = user.fullName;
        // email is already handled by default
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.fullName = token.fullName;
        // email is already handled by default
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };