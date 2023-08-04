import User from "@/models/user";
import { connectToDB } from "@/utils/db";
import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { use } from "react";


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
    signIn: "/login",
    signOut: "/"
  },

  callbacks: {  
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email
      })
  
      session.user.id = sessionUser._id.toString()
  
      return session
    },


}
  
    

  

  // async signIn({ account }) {
  //   try {
  //     await connectToDB()

  //     // check if user already exits
  //     const userExits = await UserProvider.findOne({
  //       email:profile.email
  //     })

  //     // if not  create a new user
  //     if(!userExits) {
  //       await UserProvider.create({
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
  // }
 
})

export { handler as GET, handler as POST};