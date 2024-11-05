import { connectToDB } from "@/controllers/databaseController";
import User from "@/schemas/userSchema";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import crypto from "crypto"
import { cookies } from 'next/headers';
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
    
        await connectToDB();
    
        const { email, password } = credentials;
    
        const user = await User.findOne({ email });

        const hmac = crypto.createHmac('sha256', process.env.KEY as string);
        hmac.update(password);
        const hashedPassword = hmac.digest('hex');

        if (user) {

          if (user.password === hashedPassword) {
            return user;
          } else {
            throw new Error('Invalid credentials');
          }
        } else {

          const newUser = await User.create({
            email,
            password: hashedPassword,

          });
          return newUser;
        }
      }
    })
  ],
  callbacks: {

    async signIn({ user, account }: { user: any, account: any }) {
      return true;
    },
    async jwt({ token, user, account }) {


      await connectToDB();

      const dbUser = await User.findOne({
        email: token.email
      });

      if (!dbUser) {
        return token;
      }

      // Add user id and provider to the token
      if (account?.provider && user) {
        token.provider = account.provider;
        token.id = user.id;

        // Generate your own access token and refresh token
        const accessToken = jwt.sign(
          { userId: user.id, provider: account.provider },
          // @ts-ignore
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '1d' }
        );

        const refreshToken = jwt.sign(
          { userId: user.id, provider: account.provider },
          // @ts-ignore
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '7d' }
        );

        token._id = dbUser._id;
        token.role = dbUser.role || 'USER';
        token.email = dbUser.email;
        token.name = dbUser.username;
        token.handle = dbUser.userhandle;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.picture = dbUser.profileImage;
      }
      return token;
    },
    async session({ session, token }: any) {

      // Attach access token and refresh token to the session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      session.image = token.picture;
      session.username = token.name;
      session.userhandle = token.handle;
      session.userId = token.id;

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  }
});

export { handler as GET, handler as POST };
