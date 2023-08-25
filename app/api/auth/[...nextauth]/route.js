import User from '@/models/user';
import { connectToDB } from '@/utils/db';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import Google from 'next-auth/providers/google';

connectToDB();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',

      async authorize(credentials) {
        const { email, password } = credentials;
        //Check if the user exists.

        const user = await User.findOne({ email });

        if (user) {
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );

          if (isPasswordCorrect) {
            return { ...user._doc, _id: user._id.toString() };
          } else {
            throw new Error('Invalid Password');
          }
        } else {
          throw new Error('Email not registered');
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.type === 'oauth') {
        return await signInWithOAuth({ account, profile });
      }
      return true;
    },
    async jwt({ token, trigger, session }) {
      const user = await getUserByyEmail({ email: token.email });
      token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

/**************************************************** */

async function signInWithOAuth({ account, profile }) {
  const user = await User.findOne({ email: profile.email });
  if (user) return true; //signin

  // if !user => sign up => sign in
  const newUser = new User({
    username: profile.name,
    email: profile.email,
    image: profile.picture,
    provider: account.provider,
  });

  await newUser.save();

  return true;
}

async function getUserByyEmail({ email }) {
  const user = await User.findOne({ email }).select('-password');

  if (!user) throw new Error('Email does not exist!');

  return { ...user._doc, _id: user._id.toString() };
}

// async function signInWithCredentials({ email, password }) {
//   //Check if the user exists.

//   const user = await User.findOne({ email });

//   if (user) {
//     const isPasswordCorrect = await bcrypt.compare(password, user.password);

//     if (isPasswordCorrect) {
//       return { ...user._doc, _id: user._id.toString() };
//     } else {
//       throw new Error('Invalid Password');
//     }
//   } else {
//     throw new Error('Email not registered');
//   }
// }
