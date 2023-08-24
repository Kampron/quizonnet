import User from '@/models/user';
import { connectToDB } from '@/utils/db';

// Establish database connection when the application starts
connectToDB();

export const GET = async (req, { params }) => {
  try {
    const user = await User.findById(params.id);

    if (!user) return new Response('User not found', { status: 404 });

    return new Response(JSON.stringify(user.qtnIds), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch user', { status: 500 });
  }
};
