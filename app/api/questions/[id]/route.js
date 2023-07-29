import Questions from "@/models/questions";
import { connectToDB } from "@/utils/db";
import { NextResponse } from "next/server";


export const GET = async (req, ctx) => {

  const id = ctx.params.id

  try {
    await connectToDB()

    const question = await Questions.findById(id)


    return new NextResponse(JSON.stringify(question), { status: 200 })
  } catch (error) {
    return new NextResponse("Failed to fetch question", { status: 500 })
  }
}