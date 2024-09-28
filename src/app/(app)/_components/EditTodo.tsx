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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditTodoProps {
  id: string;
  value: string;
  todoTypeId: string;
  isCompleted: boolean;
  todoPriority: number;
  handler: () => void;
}

export function EditTodo({
  id,
  value,
  todoTypeId,
  todoPriority,
  isCompleted,
  handler,
}: EditTodoProps) {
  const [editedTask, setEditedTask] = useState(value);
  const [priority, setPriority] = useState(todoPriority);

  const handleClick = (number: number) => {
    setPriority(number)
  }

  useEffect(() => {
    setEditedTask(value);
    setPriority(todoPriority);
  }, [value, todoPriority]);

  const editHandler = async () => {
    try {
      await axios.post(`/api/edit-todo/${todoTypeId}`, {
        id,
        task: editedTask,
        priority,
      })
      .then(() => toast.success("Todo updated successfully"))
      .catch(() => toast.error("Failed to update todo"));
      handler();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild disabled={isCompleted}>
        <Button className="bg-[#30C023] px-3 sm:py-6 py-3 rounded-lg hover:bg-[#2baf1f] drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] text-white font-monkey transition-all flex items-center gap-2">
          <span className="sm:text-2xl text-lg">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] font-monkey rounded-3xl sm:top-1/2 top-1/4">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="task" className="text-2xl">
            Todo
          </Label>
          <Input
            id="task"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
            className="bg-black text-white h-12 rounded-xl text-lg focus-visible:ring-0 focus-visible:outline-0"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-xl font-semibold">Priority: {priority}</p>
          {/* <div className="flex gap-4 mb-4">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-4 cursor-pointer rounded-tr-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] ${
                  priority >= num
                    ? num === 1
                      ? "bg-green-500"
                      : num === 2
                      ? "bg-yellow-500"
                      : "bg-red-500"
                    : "bg-gray-300"
                }`}
                onClick={() => setPriority(num)}
              />
            ))}
          </div> */}
          <div className="flex gap-4 mb-4">
                <div
                  className={`w-8 h-4 cursor-pointer rounded-tr-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] ${
                    priority >= 1
                      ? priority === 1
                        ? "bg-green-500"
                        : priority === 2
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      : "bg-gray-300"
                  }`}
                  onClick={() => handleClick(1)}
                >
                </div>
                <div
                  className={`w-8 h-4 cursor-pointer rounded-tr-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] ${
                    priority >= 2
                      ? priority === 2
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      : "bg-gray-300"
                  }`}
                  onClick={() => handleClick(2)}
                >
                </div>
                <div
                  className={`w-8 h-4 cursor-pointer rounded-tr-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] ${
                    priority === 3 ? "bg-red-500" : "bg-gray-300"
                  }`}
                  onClick={() => handleClick(3)}
                >
                </div>
              </div>
        </div>
        <DialogFooter className="w-full flex flex-row justify-between sm:justify-between">
          <DialogClose>
            <Button onClick={() => setPriority(todoPriority)} className="bg-[#FF2121] text-xl rounded-xl py-5">
              Close
            </Button>
          </DialogClose>
          <DialogClose>
            <Button onClick={editHandler} className="bg-[#30C023] text-xl rounded-xl py-5" type="button">
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
