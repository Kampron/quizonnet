import { NextResponse } from 'next/server';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { connectToDB } from '@/utils/db';
import { generateToken, verifyToken } from '@/utils/token';
import sendEmail from '@/utils/sendEmail';
import { redirect } from 'next/dist/server/api-utils';

const BASE_URL = process.env.NEXTAUTH_URL;
export const POST = async (request) => {
  const data = await request.json();

  await connectToDB();

  const isExisting = await User.findOne({ email: data.email });

  if (isExisting) {
    return new NextResponse('Email registered already', {
      status: 501,
    });
  }
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const newUser = new User({
    username: data.username,
    email: data.email,
    password: hashedPassword,
  });

  const token = generateToken({ user: newUser });
  await sendEmail({
    to: newUser.email,
    url: `${BASE_URL}/verify?token=${token}`,
    text: 'VERIFY EMAIL',
  });

  try {
    await newUser.save();
    return new NextResponse('User has been created', {
      status: 201,
    });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};

export async function verifyWithCredentials(token) {
  try {
    const { user } = verifyToken(token);
    const userExist = await User.findOne({ email: user.email });
    if (userExist) return { msg: 'Verify Success!' };
    const newUser = new User(user);
    await newUser.save();
    console.log(newUser);
  } catch (error) {
    redirect(`/errors?error=${error.message}`);
  }
}
