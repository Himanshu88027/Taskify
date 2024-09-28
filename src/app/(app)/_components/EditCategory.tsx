"use client"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditCategoryProps {
    id: string;
    value: string;
    handler: () => void;
}

export function EditCategory({ id, value, handler }: EditCategoryProps) {
    const [editedTask, setEditedTask] = useState(value);

    useEffect(() => {
        setEditedTask(value);
    }, [value]);

    const editHandler = async () => {
        try {
            await axios.post(`/api/edit-todo-type/`, {
                id,
                task: editedTask,
            })
            .then(() => toast.success("Todo category updated successfully"))
            .catch(() => toast.error("Failed to update todo category"));
            handler();
        } catch (error) {
            console.error("Failed to update category", error);
            toast.error("Failed to update todo category");
        } finally {
            setEditedTask(value); // Reset task after the operation
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#30C023] px-3 py-6 rounded-lg hover:bg-[#2baf1f] drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] text-white font-monkey transition-all flex items-center gap-2">
                    <span className="text-2xl">Edit</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-w-[400px] font-monkey rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Edit todo category</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="task" className="text-2xl">
                        Category :
                    </Label>
                    <Input
                        id="task"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        className="bg-black text-white h-12 rounded-xl text-lg focus-visible:ring-0 focus-visible:outline-0"
                    />
                </div>
                <DialogFooter className="w-full flex flex-row justify-between items-center">
                    <DialogClose>
                        <Button className="bg-[#FF2121] text-xl rounded-xl py-5">
                            Close
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button 
                            onClick={editHandler} 
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
}
