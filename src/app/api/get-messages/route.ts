import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){

    dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {

        // now we create an aggregation pipeline to get all the messages that are sent to the current user
        const user = await UserModel.aggregate([
            { $match: {_id: userId}},
            { $unwind: '$messages'},
            { $sort: {'messages.createdAt' : -1} }, // sort the messages in ascending order (most recent message first)
            { $group: {_id: '$_id', messages: {$push: '$messages'} } } // group all the messages of a particular user together
        ])

        if(!user || user.length === 0){
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: user[0].messages,
            },
            { status: 200 }
        )

    } catch (error) {
        
    }

}