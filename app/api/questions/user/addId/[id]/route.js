import User from "@/models/user";
import { connectToDB } from "@/utils/db";

/** PATCH */

export const PATCH = async (req, { params }) => {
  const { id } = await req.json()
  try {
    await connectToDB()
    const existingUser = await User.findById(params.id)

    if(!existingUser) return new Response("User not found", { status: 404 })
    
    existingUser.qtnIds.push(id);

    await existingUser.save()

    return new Response(JSON.stringify(existingUser), { status: 200 })
  } catch (error) {
    return new Response("Failed to update the  user", { status: 500 })
  }
}