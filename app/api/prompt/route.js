import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt"

export const GET = async (request) => {
  const queryParams = request.nextUrl.searchParams
  const s = queryParams.get("s")
  try {
    await connectToDB()
    let prompts

    if (s) {
      prompts = await Prompt.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'
          }
        },
        {
          $unwind: '$creator'
        },
        {
          $match: {
            $or: [
              { prompt: { $regex: new RegExp(s, 'i') } },
              { tag: s },
              { 'creator.username': s },
              { 'creator.email': s }
            ]
          }
        }
      ])
    } else {
      prompts = await Prompt.find({}).populate("creator")
    }

    return new Response(JSON.stringify(prompts), {
      status: 200
    })
  } catch (error) {
    console.log(error)
    return new Response("Failed to fetch prompts", {
      status: 500
    })
  }
}