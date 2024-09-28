import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { id, task } = await request.json();

    // Input validation
    if (!id || !task) {
      return new Response(
        JSON.stringify({ success: false, message: "id and task are required" }),
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

    // Update the task in the specific todoType
    const user = await UserModel.updateOne(
      {
        _id: userId,
        "todoTypes._id": id, // Find the correct todoType
      },
      {
        $set: {
          "todoTypes.$[type].task": task, // Update the task field
        },
      },
      {
        arrayFilters: [
          { "type._id": id }, // Filter to match correct todoType
        ],
      }
    );

    // Check if the task was updated
    if (user.matchedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "TodoType not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Task updated successfully" }),
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
