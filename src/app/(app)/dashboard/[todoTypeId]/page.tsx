"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { FolderPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TodoList } from "../../_components/Todo";
import { toast } from "sonner";

interface Props {
  params: {
    todoTypeId: string;
  };
}

const Todo = ({ params }: Props) => {
  const { todoTypeId } = params;
  const [tasks, setTasks] = useState([]);
  const [addTodo, setAddTodo] = useState("");
  const [heading, setHeading] = useState("");
  const [priority, setPriority] = useState(1)
  const [progress, setProgress] = useState(1)

  const handleClick = (number: number) => {
    setPriority(number)
  }
  const handleSliderChange = (value: number[]) => {
    setProgress(value[0])
  }

  const fetchTodoTasks = useCallback(async () => {
    const response = await axios.get(`/api/get-todo/${todoTypeId}`);
    setTasks(response.data.todo);
  }, [todoTypeId]);

  const todoHeading = async () => {
    const response = await axios.get(`/api/get-heading/${todoTypeId}`);
    setHeading(response.data.heading);
  };

  const deleteTodo = async (taskId: string) => {
    await axios.post(`/api/delete-todo/${todoTypeId}`, {
      taskId,
    }).then(() => toast.success("Todo deleted successfully"))
      .catch(() => toast.error("Failed to delete todo"));
    await fetchTodoTasks();
  };

  useEffect(() => {
    todoHeading();
  }, []);

  useEffect(() => {
    fetchTodoTasks();
  }, [fetchTodoTasks]);
  const onSubmit = async () => {
    try {
      await axios.post("/api/add-todo", {
        todoTypeId,
        addTodo,
        isCompleted: false,
        priority,
        progress
      }).then(() => toast.success("Todo added successfully"))
        .catch(() => toast.error("Failed to add todo"));
      await fetchTodoTasks();
      setAddTodo("");
      setPriority(1)
      setProgress(1)
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full px-4 sm:px-8 py-8">
      <div className="w-full py-6 rounded-xl bg-[#D8BAAA] flex justify-center items-center">
        <h1 className="font-fredericka text-5xl sm:text-5xl md:text-6xl font-normal">{heading ? heading : "Todo"}</h1>
      </div>
      <div className="w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#5B62FF] px-6 py-7 rounded-lg hover:bg-[#4850dd] drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] text-white font-monkey transition-all flex items-center gap-2">
              <FolderPlus className="w-7 h-7" />
              <span className="text-2xl">Create todo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-w-[400px] font-monkey rounded-3xl sm:rounded-3xl top-1/4 sm:top-1/2">
            <DialogHeader>
              <DialogTitle>Add todo</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category" className="text-2xl">
                Add to-do
              </Label>
              <Input
                id="category"
                value={addTodo}
                onChange={(e) => setAddTodo(e.target.value)}
                className="bg-black text-white h-12 rounded-xl text-lg focus-visible:ring-0 focus-visible:outline-0"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-4 w-1/2">
                <p className="text-xl font-semibold">Progress: {progress}%</p>
                <Slider
                value={[progress]}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
                className='w-full h-4'
                />
              </div>

              <div className="flex flex-col items-end gap-4 w-1/2">
                <p className="text-xl font-semibold">Priority: {priority}</p>
                <div className="flex gap-4">
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
            </div>
            <DialogFooter className="flex flex-row !justify-between !sm:justify-between items-center w-full relative mt-4">
              <DialogClose>
                <Button onClick={() => setProgress(1)} className="bg-[#FF2121] text-xl rounded-xl py-5">
                  Close
                </Button>
              </DialogClose>
              <DialogClose>
                <Button
                  onClick={onSubmit}
                  className="bg-[#30C023] text-xl rounded-xl py-5"
                  type="submit"
                >
                  Add
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <TodoList
        todos={tasks}
        todoTypeId={todoTypeId}
        handler={fetchTodoTasks}
        deleteTodo={deleteTodo}
      />
    </div>
  );
};

export default Todo;