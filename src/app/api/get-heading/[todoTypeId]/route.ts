import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";

export async function GET(request: Request, { params }: { params: { todoTypeId: string } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User | undefined = session?.user as User;

    // Session and user validation
    if (!_user) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    const { todoTypeId } = params;
    const userId = _user._id;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(todoTypeId)) {
      return new Response(JSON.stringify({ success: false, message: "Invalid todoTypeId" }), { status: 400 });
    }

    const user = await UserModel.findOne({
      _id: userId,
      "todoTypes._id": todoTypeId,
    });

    // Check if user and todoType exist
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User or todoType not found" }), { status: 404 });
    }

    const todoType = user.todoTypes.find((type: any) => type._id.toString() === todoTypeId);
    
    // Check if the todoType exists and contains the task
    if (!todoType || !todoType.task) {
      return new Response(JSON.stringify({ success: false, message: "TodoType or task not found" }), { status: 404 });
    }

    const heading = todoType.task;

    return new Response(JSON.stringify({ success: true, heading }), { status: 200 });
  } catch (error) {
    console.error("Error fetching todo type:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
  }
}
