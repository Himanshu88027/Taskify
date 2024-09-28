import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";
import UserModel from "@/models/user.model";

export async function GET() {
    try {
        await dbConnect();
        
        // Retrieve user session
        const session = await getServerSession(authOptions);
        const _user: User | undefined = session?.user as User;

        // Validate user session
        if (!_user) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
        }

        const userId = new mongoose.Types.ObjectId(_user._id);

        // Aggregate to fetch todoTypes for the user
        const user = await UserModel.aggregate([
            {
                $match: { _id: userId }
            },
            {
                $unwind: {
                    path: '$todoTypes',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$_id",
                    todoTypes: { $push: "$todoTypes" }
                }
            }
        ]);

        if (user.length === 0) {
            return new Response(JSON.stringify({ success: false, message: "No todo types found" }), { status: 404 });
        }

        return new Response(
            JSON.stringify({ success: true, todoTypes: user[0].todoTypes || [] }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error fetching todos:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
}
