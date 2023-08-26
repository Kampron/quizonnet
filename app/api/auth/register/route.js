import { NextResponse } from 'next/server';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { connectToDB } from '@/utils/db';
import { generateToken, verifyToken } from '@/utils/token';
import sendEmail from '@/utils/sendEmail';
import { redirect } from 'next/dist/server/api-utils';

const BASE_URL = process.env.NEXTAUTH_URL;

connectToDB();
export const POST = async (request) => {
  const data = await request.json();

  const isExisting = await User.findOne({ email: data.email });

  if (isExisting) {
    return new NextResponse('Email registered already', {
      status: 409,
    });
  }
  const hashedPassword = isExisting
    ? null
    : await bcrypt.hash(data.password, 12);

  const newUser = new User({
    username: data.username,
    email: data.email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }

  const token = generateToken({ user: newUser });
  try {
    await sendEmail({
      to: newUser.email,
      url: `${BASE_URL}/verify?token=${token}`,
      text: 'VERIFY EMAIL',
    });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }

  return new NextResponse('User has been created', {
    status: 201,
  });
};

export async function verifyWithCredentials(token) {
  try {
    const { user } = verifyToken(token);
    const userExist = await User.findOne({ email: user.email });
    if (userExist) {
      return { msg: 'Verify Success!' };
    } else {
      const newUser = new User(user);
      await newUser.save();
    }
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
