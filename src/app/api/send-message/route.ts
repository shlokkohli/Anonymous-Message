import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from '@/models/User'

export async function POST(request: Request){

    await dbConnect();

    const {username, content} = await request.json();

    try {
        
        const user = await UserModel.findOne( {username} )

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            )
        }

        // after getting the user, first we need to make sure if the user is accepting messages or not
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages",
                },
                { status: 403 }
            )
        }

        // if the user is accepting messages, create the message
        const newMessage = {content, createdAt: new Date()}

        // push this message in the user's message array
        user.messages.push(newMessage as Message)

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 200}
        )

    } catch (error) {
        console.log("Error adding messages: ", error)
        return Response.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        )
    }

}