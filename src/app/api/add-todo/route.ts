import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import UserModel, { TodoTasks } from "@/models/user.model";

export async function POST(request: Request) {
    try {
        await dbConnect();
        
        const { todoTypeId, addTodo, isCompleted, priority, progress } = await request.json();
        console.log(isCompleted)
        console.log(priority)
        if (!todoTypeId || !addTodo) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid data" }),
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session?.user?.username) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const username = session.user.username;

        const user = await UserModel.findOne({ username });
        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }

        const todoType = user.todoTypes?.find((type: any) => type._id.toString() === todoTypeId);
        if (!todoType) {
            return new Response(
                JSON.stringify({ success: false, message: "TodoType not found" }),
                { status: 404 }
            );
        }

        const newTask = {
            task: addTodo,
            isCompleted,
            priority,
            progress,
            createdAt: new Date(),
        };

        todoType.todoTasks.push(newTask as TodoTasks);
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
