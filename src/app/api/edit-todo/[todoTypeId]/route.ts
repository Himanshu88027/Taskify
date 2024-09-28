import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(
  request: Request,
  { params }: { params: { todoTypeId: string } }
) {
  try {
    await dbConnect();

    const { task, id, priority } = await request.json();
    const { todoTypeId } = params;

    console.log(task)
    console.log(id)

    // Input validation
    if (!todoTypeId || !id || !task) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid input data" }),
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

    // Find and update the correct task in the specific todoType
    const user = await UserModel.updateOne(
      {
        _id: userId,
        "todoTypes._id": todoTypeId,        // Find the correct todoType
        "todoTypes.todoTasks._id": id,      // Find the correct todoTask
      },
      {
        $set: {
          "todoTypes.$[type].todoTasks.$[task].task": task, // Update the task field
          "todoTypes.$[type].todoTasks.$[task].priority": priority, // Update the task field
        },
      },
      {
        arrayFilters: [
          { "type._id": todoTypeId },       // Filter to match correct todoType
          { "task._id": id },               // Filter to match correct todoTask
        ],
      }
    );

    if (user.matchedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "TodoType or Task not found" }),
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
