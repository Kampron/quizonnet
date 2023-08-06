import User from "@/models/user";
import { connectToDB } from "@/utils/db";
import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google";


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    }),
    
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      async authorize(credentials) {
        const { email, password } = credentials
        //Check if the user exists.
        await connectToDB()

           const user = await User.findOne({ email });

          if(user) {
            const isPasswordCorrect = await bcrypt.compare(
              password,
              user.password
            );

            if (isPasswordCorrect) {
              return user;
            } else {
              throw new Error("Invalid Password") 
            }
          } else {
            throw new Error("Email not registered")
          }
      }
    })
  ],
  pages: {
    
  },

  

  callbacks: {  

    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin

      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },

    async session({ session, token }) {

      
        session.user.accessToken = token.accessToken

          const sessionUser = await User.findOne({
            email: session.user.email
          })
          session.user.id = sessionUser._id
      

      return session
    },

    


    // async signIn({ profile }) {
    //   try {
    //     await connectToDB()
  
    //     // check if user already exits
    //     const userExits = await User.findOne({
    //       email:profile.email
    //     })
  
    //     // if not  create a new user
    //     if(!userExits) {
    //       await User.create({
    //         email: profile.email,
    //         username: profile.name.replace(" ", "").toLowerCase(),
    //         image: profile.picture
    //       })
    //     }
  
    //     return true
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
  }
  
})

export { handler as GET, handler as POST};