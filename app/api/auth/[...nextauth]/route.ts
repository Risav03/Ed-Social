import { connectToDB } from "@/controllers/databaseController";
import User from "@/schemas/userSchema"
import jwt from "jsonwebtoken";
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import crypto from "crypto";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

interface HashedPassword {
  hash: string;
  salt: string;
}

interface AuthUser extends UserType {
  id: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: string;
    };
    accessToken: string;
  }

  interface User extends AuthUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
  }
}

const HASH_ITERATIONS = 100000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = 'sha512';
const ACCESS_TOKEN_EXPIRY = '15m';

const hashPassword = async (password: string, salt?: string): Promise<HashedPassword> => {
  const generateSalt = salt || crypto.randomBytes(16).toString('hex');
  
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      generateSalt,
      HASH_ITERATIONS,
      HASH_KEYLEN,
      HASH_DIGEST,
      (err, derivedKey) => {
        if (err) reject(err);
        resolve({
          hash: derivedKey.toString('hex'),
          salt: generateSalt
        });
      }
    );
  });
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<AuthUser | null> {
        try {

          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }

          if (!isValidEmail(credentials.email)) {
            throw new Error('Invalid email format');
          }

          if (!isValidPassword(credentials.password)) {
            throw new Error('Invalid password format');
          }

          await connectToDB();

          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          }).select('+pwd +salt');

          
          if (!user) {
            throw new Error('Invalid credentials');
          }
          
          const { hash } = await hashPassword(credentials.password, user.salt);
          
          console.log(hash);
          const isValid = crypto.timingSafeEqual(
            Buffer.from(hash, 'hex'),
            Buffer.from(user.pwd, 'hex')
          );

          console.log(isValid);


          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          const userObject = user.toObject();
          delete userObject.pwd;
          delete userObject.salt;

          return {
            ...userObject,
            id: userObject._id.toString()
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Invalid credentials');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, 
  },
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      if (account?.provider && user) {
        const accessToken = jwt.sign(
          { 
            userId: user.id,
            role: user.role
          },
          process.env.NEXTAUTH_SECRET as string,
          { 
            expiresIn: ACCESS_TOKEN_EXPIRY,
            algorithm: 'HS512'
          }
        );

        return {
          ...token,
          id: user.id,
          role: user.role || 'USER',
          accessToken
        };
      }
      return token;
    },

    async session({ session, token }): Promise<any> {
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          role: token.role
        },
        accessToken: token.accessToken
      };
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: true,
};

const handler = NextAuth(authOptions);

const authHandler = async (req: Request, res: Response) => {
  try {
    // @ts-ignore 
    return await handler(req, res);
  } catch (error: any) {
    console.error('Authentication error:', error);
    
    const message = 'Authentication failed'

    return new NextResponse(
      JSON.stringify({ status: 'error', message }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export { authHandler as GET, authHandler as POST };