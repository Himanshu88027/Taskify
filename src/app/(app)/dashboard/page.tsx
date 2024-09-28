"use client";

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
import { FolderPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Category } from "../_components/Category";


const UserDashboardPage = () => {
  const [category, setCategory] = useState('');
  const [todoTypes, setTodoTypes] = useState([]);

  const fetchTodoTypes = useCallback(async () => {
    try {
      const response = await axios.get("/api/get-todo-type");
      setTodoTypes(response.data.todoTypes);
    } catch (error) {
      console.error(error)
    }
  }, []);

  const deleteTodo = async (todoId: string) => {
    await axios.post(`/api/delete-todo-type`, { todoId })
    .then(() => toast.success("Todo category deleted successfully"))
    .catch(() => toast.error("Failed to delete todo category"));
    await fetchTodoTypes();
  };

  useEffect(() => {
    fetchTodoTypes();
  }, [fetchTodoTypes]);
  const onSubmit = async () => {
    try {
      await axios.post("/api/add-todo-types", {category})
      .then(() => toast.success("Todo category added successfully"))
      .catch(() => toast.error("Failed to add todo category"));
      await fetchTodoTypes();
      setCategory('');
    } catch (error) {
      console.error(error)
    }
  };


  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full px-4 sm:px-8 py-8">
      <div className="w-full flex flex-col space-y-4 sm:flex-row justify-between items-baseline">
        <h1 className="font-fredericka text-7xl md:text-8xl font-normal">Categories</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#5B62FF] px-6 py-7 w-full sm:w-auto rounded-lg hover:bg-[#4850dd] drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] text-white font-monkey transition-all flex items-center gap-2">
              <FolderPlus className="w-7 h-7" />
              <span className="text-2xl">Create</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-w-[400px] font-monkey rounded-3xl sm:rounded-3xl">
            <DialogHeader>
              <DialogTitle>Add todo category</DialogTitle>
            </DialogHeader>
            <div className="">
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="text-2xl">
                  Category
                </Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-black text-white h-12 rounded-xl text-lg focus-visible:ring-0 focus-visible:outline-0"
                />
              </div>
            </div>
            <DialogFooter className="flex !justify-between flex-row !sm:justify-between items-center w-full">
              <DialogClose>
                <Button className="bg-[#FF2121] text-xl rounded-xl py-5">Close</Button>
              </DialogClose>
              <DialogClose>
                <Button onClick={onSubmit} className="bg-[#30C023] text-xl rounded-xl py-5" type="submit">Add</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Category todoTypes={todoTypes} handler={fetchTodoTypes} deleteTodo={deleteTodo} />
    </div>
  );
};

export default UserDashboardPage;
