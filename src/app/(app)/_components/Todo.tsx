import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TodoTasks } from "@/models/user.model";
import { useIsClient } from "usehooks-ts";
import { Delete } from "./Delete";
import { EditProgress } from "./EditProgress";
import { EditTodo } from "./EditTodo";
import { ClickableBoxes } from "./Priority";
import TaskCheckbox from "./TodoCheckBox";

interface TodoProps{
    todos: TodoTasks[];
    todoTypeId: string;
    handler: () => void;
    deleteTodo: (id: string) => void
}

export const TodoList = ({
    todos, todoTypeId, handler, deleteTodo
}: TodoProps) => {
    const isClient = useIsClient()
    if (!isClient) {
        return <TodoSkeleton />
    }
    return (
        <>
            {todos.map((todo) => (
                <div key={`${todo._id}`} className="flex flex-col w-full justify-between items-center py-3 px-5 bg-[#FFCC9D] rounded-xl">
                  <div className="flex w-full justify-between items-center">
                    <div className="flex sm:w-1/2 w-2/3 justify-start items-center gap-2 sm:gap-6">
                      <TaskCheckbox handler={handler} todoTypeId={todoTypeId} initialIsCompleted={todo.isCompleted} completeId={`${todo._id}`} />
                      <h1 className={cn(" w-1/2 sm:w-1/3 text-sm lg:text-base truncate",
                        todo.isCompleted ? 'line-through decoration-2' : '',
                      )}>{todo.task}</h1>
                      <ClickableBoxes priority={todo.priority} />
                    </div>
                    <div className="flex sm:justify-between justify-end w-1/5 sm:w-auto items-center gap-6">
                      <EditProgress className='hidden sm:flex' todo={todo} todoTypeId={todoTypeId} handler={handler} isCompleted={todo.isCompleted}/>
                      <div className="flex justify-center items-center sm:gap-6 gap-3">
                        <EditTodo id={`${todo._id}`} value={todo.task} handler={handler} todoTypeId={todoTypeId} todoPriority={todo.priority} isCompleted={todo.isCompleted} />
                        <Delete cross='w-6 sm:w-8 h-6 sm:h-8' className='p-1.5 sm:p-2' id={`${todo._id}`} label='Delete todo' handler={deleteTodo} description="Are you sure you want to delete this todo? This will permanently remove the todo along with its progress and cannot be undone." />
                      </div>
                    </div>
                  </div>
                  <EditProgress className='sm:hidden relative mt-3 flex w-full' todo={todo} todoTypeId={todoTypeId} handler={handler} isCompleted={todo.isCompleted}/>
                </div>
            ))}
        </>
    )
}

export function TodoSkeleton({ count = 3 }: { count?: number }) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex w-full justify-between items-center py-5 px-5 bg-[#ffdcbbbb] rounded-xl mb-2">
            <div className="flex justify-start items-center gap-2 sm:gap-6">
              <Skeleton className="w-5 h-5 rounded-sm" />
              <Skeleton className="w-24 h-6" />
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-4 h-4 rounded-sm" />
                ))}
              </div>
            </div>
            <div className="flex justify-between w-2/5 items-center gap-2 sm:gap-6">
              <Skeleton className="w-16 h-6" />
              <div className="flex justify-center items-center gap-2 sm:gap-6">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </>
    )
  }