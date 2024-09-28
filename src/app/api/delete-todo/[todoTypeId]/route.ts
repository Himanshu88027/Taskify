import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import UserModel from "@/models/user.model";

export async function POST(request: Request, { params }: { params: { todoTypeId: string } }) {
    try {
        await dbConnect();

        const { todoTypeId } = params;
        const { taskId } = await request.json();

        // Validate request parameters and body
        if (!todoTypeId || !taskId) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid todoTypeId or taskId" }),
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

        // Find user and update the specific todoType by removing the task
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId, "todoTypes._id": todoTypeId },
            { $pull: { "todoTypes.$.todoTasks": { _id: taskId } } },
            { new: true } // Returns the updated document
        );

        // Check if the user or todoType exists
        if (!updatedUser) {
            return new Response(
                JSON.stringify({ success: false, message: "TodoType or Task not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Task removed successfully" }),
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
