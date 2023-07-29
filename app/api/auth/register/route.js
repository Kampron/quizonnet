
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs"
import { connectToDB } from "@/utils/db";



export const POST = async (request) => {

    const { username, email, password } = await request.json();

    await connectToDB()

    const isExisting = await User.findOne({email})

    if(isExisting){
        return new NextResponse("Email registered already", {
        status: 501,
    })
        }
    const hashedPassword = await bcrypt.hash(password, 7)

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try{
        await newUser.save();
        return new NextResponse("User has been created", {
            status: 201,
        })
    }catch(err){
        return new NextResponse(err.message, {
            status: 500,
        });
    }
};