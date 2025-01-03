import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}){

    const messageId = params.messageid // jis message ko delete karna hai uski ID

    dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User // this is the currently logged in user

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }

    try {

        const updateResult = await UserModel.updateOne(
            { id: user._id},
            { $pull: {messages: {_id: messageId}} } // jis specific id wale message ko delete karna hai usko messages array se hata do
        )

        // if no message was deleted
        if(updateResult.modifiedCount === 0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted",
                },
                { status: 404 }
            )
        }

        // if message was deleted
        return Response.json(
            {
                success: true,
                response: "Message Deleted",
            },
            { status: 200 }
        )
        
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error deleting message",
            },
            { status: 500 }
        )
    }

}