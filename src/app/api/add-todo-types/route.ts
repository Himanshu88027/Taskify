import dbConnect from "@/lib/dbConnect";
import UserModel, { TodoType } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(request: Request) {
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        if (!session?.user?.username) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const username = session.user.username;
        const { category } = await request.json();
        if (!category) {
            return new Response(
                JSON.stringify({ success: false, message: "Task is required" }),
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ username });
        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }

        const newType = {
            task: category,
            createdAt: new Date(),
        };

        user.todoTypes.push(newType as TodoType);
        await user.save();

        return new Response(
            JSON.stringify({ success: true, message: "Task added." }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Server error" }),
            { status: 500 }
        );
    }
}
