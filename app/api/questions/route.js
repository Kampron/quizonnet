import Questions from "@/models/questions"
import { connectToDB } from "@/utils/db"



export const GET = async (req) => {
  try {
    await connectToDB()

    const questions = await Questions.find({})

    return new Response(JSON.stringify(questions), { status: 200 })
  } catch (error) {
    return new Response("Failed to fetch all English Shs Questions")
  }
}


export const POST = async (req) => {
  const { subject, year, month, questions, link, type } = await req.json()

  try {
    await connectToDB()
    const newQuestion = new Questions({
      subject,
      year,
      month,
      link,
      type,
      questions
    })

    await newQuestion.save()
    return new Response(JSON.stringify(newQuestion), { status: 201 })
  } catch (error) {
    return new Response("Failed to create a new EnglishShs", { status: 500 });
  }
}