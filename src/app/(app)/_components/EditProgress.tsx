import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { TodoTasks } from "@/models/user.model";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface EditProgressProps {
    todo: TodoTasks;
    todoTypeId: string;
    isCompleted: boolean;
    className?: string;
    handler: () => void;
}

export const EditProgress = ({ todo, todoTypeId, handler, isCompleted, className }: EditProgressProps) => {
    const [progress, setProgress] = useState(todo.progress);

    // Update local progress state when `todo.progress` or `isCompleted` changes
    useEffect(() => {
        setProgress(isCompleted ? 100 : todo.progress);
    }, [todo.progress, isCompleted]);

    const handleSliderChange = useCallback((value: number[]) => {
        if (!isCompleted) {
            setProgress(value[0]);
        }
    }, [isCompleted]);

    const onSubmit = useCallback(async () => {
        try {
            await axios.post(`/api/update-todo-progress/${todoTypeId}`, {
                todoId: todo._id,
                progress: isCompleted ? 100 : progress,
            })
            .then(() => toast.success("Progress updated successfully"))
            .catch(() => toast.error("Failed to update progress"));
            handler(); // Trigger any additional actions, like revalidation or UI updates
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    }, [todoTypeId, todo._id, progress, isCompleted, handler]);

    return (
        <Dialog>
            <DialogTrigger disabled={isCompleted} className={cn("justify-center items-center gap-4", className)}>
                <Progress value={todo.isCompleted ? 100 : todo.progress} className='w-full sm:w-24 lg:w-52 drop-shadow-[0_3px_2px_rgba(0,0,0,0.25)]' />
                <p>{todo.isCompleted ? 100 : todo.progress}%</p>
            </DialogTrigger>
            <DialogContent className="font-monkey max-w-[400px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="font-monkey">Update Progress</DialogTitle>
                </DialogHeader>
                <Slider
                    value={[progress]}
                    onValueChange={handleSliderChange}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={isCompleted}
                />
                <p>{progress}%</p>
                <DialogFooter className="flex !justify-between flex-row items-center w-full">
                    <DialogClose>
                        <Button
                            onClick={() => setProgress(todo.progress)} // Reset slider to DB progress
                            className="bg-[#FF2121] text-xl rounded-xl py-5"
                        >
                            Close
                        </Button>
                    </DialogClose>
                    <DialogClose>
                        <Button
                            onClick={onSubmit}
                            className="bg-[#30C023] text-xl rounded-xl py-5"
                            type="button" // Changed to "button" to prevent form submission
                        >
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
