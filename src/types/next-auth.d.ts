import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

// Extend the built-in JWT type
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    fullName: string;
  }
}

// Extend the built-in Session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      fullName: string;
    } & DefaultSession['user']; // Keep the default properties like 'name', 'email', 'image'
  }

  // Extend the built-in User type
  interface User extends DefaultUser {
    username: string;
    fullName: string;
  }
}