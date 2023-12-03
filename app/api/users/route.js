import { connectToDB } from '@utils/database'
import User from '@models/user'

export const GET = async (request, { params }) => {
  const queryParams = request.nextUrl.searchParams
  const email = queryParams.get("email")
  try {
    connectToDB()

    const user = await User.findOne({ email: email })

    if (!user) {
      return new Response('User not found', { status: 404 })
    }

    return new Response(JSON.stringify(user), {
      status: 200
    })
  } catch (error) {
    return new Response('Failed to fetch user', {
      status: 500
    })
  }

}