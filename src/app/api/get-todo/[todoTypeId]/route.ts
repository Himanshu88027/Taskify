import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import mongoose from "mongoose";
import UserModel from "@/models/user.model";

export async function GET(request: Request, { params }: { params: { todoTypeId: string } }) {
  try {
    await dbConnect();

    // Retrieve session and user information
    const session = await getServerSession(authOptions);
    const _user: User | undefined = session?.user as User;

    // Validate user session
    if (!_user) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    const todoTypeId = new mongoose.Types.ObjectId(params.todoTypeId);
    const userId = new mongoose.Types.ObjectId(_user._id);

    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(params.todoTypeId)) {
      return new Response(JSON.stringify({ success: false, message: "Invalid todoTypeId" }), { status: 400 });
    }

    const user = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: {
          path: "$todoTypes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "todoTypes._id": todoTypeId,
        },
      },
      {
        $project: {
          todoTasks: "$todoTypes.todoTasks",
        },
      },
    ]);

    // Check if todoTasks exist
    if (!user.length) {
      return new Response(JSON.stringify({ success: false, message: "TodoType not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, todo: user[0].todoTasks || [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
  }
}
