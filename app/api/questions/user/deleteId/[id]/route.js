import User from '@/models/user';
import { connectToDB } from '@/utils/db';

/** PATCH */
// Establish database connection when the application starts
connectToDB();
export const PATCH = async (req, { params }) => {
  const { id } = await req.json();
  try {
    const existingUser = await User.findById(params.id);

    if (!existingUser) return new Response('User not found', { status: 404 });

    if (existingUser.qtnIds) {
      existingUser.qtnIds.remove(id);
    }

    await existingUser.save();

    return new Response(JSON.stringify(existingUser), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};
