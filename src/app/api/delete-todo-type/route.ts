import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import UserModel from "@/models/user.model";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { todoId } = await request.json();
        if (!todoId) {
            return new Response(
                JSON.stringify({ success: false, message: "todoId is required" }),
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const userId = session.user._id;
        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }

        // Find user and remove the specified todoType
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId, "todoTypes._id": todoId },
            { $pull: { todoTypes: { _id: todoId } } },
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return new Response(
                JSON.stringify({ success: false, message: "TodoType not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "TodoType removed successfully" }),
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
