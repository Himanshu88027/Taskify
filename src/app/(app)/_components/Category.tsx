import { Skeleton } from "@/components/ui/skeleton";
import { TodoType } from "@/models/user.model";
import Link from "next/link";
import { useIsClient } from "usehooks-ts";
import { Delete } from "./Delete";
import { EditCategory } from "./EditCategory";

interface CategoryProps {
    todoTypes: TodoType[];
    handler: () => void;
    deleteTodo: (id: string) => void;
}

export const Category = ({ todoTypes, handler, deleteTodo }: CategoryProps) => {
    const isClient = useIsClient();

    if (!isClient) {
        return <TodoTypeSkeleton />;
    }

    return (
        <>
            {todoTypes.map((todo) => (
                <div 
                    key={`${todo._id}`} // Using template literal for unique identifier
                    className="flex w-full justify-between items-center py-3 px-5 bg-[#FFCC9D] rounded-xl mb-2" // Added margin bottom for better spacing
                >
                    <div className="flex justify-start items-center gap-6 w-full">
                        <Link 
                            href={`/dashboard/${todo._id}`} 
                            className="sm:text-2xl truncate text-lg w-[calc(100%-40px)] py-4 px-3 rounded-xl hover:bg-[#f5c08f] transition-all cursor-pointer"
                        >
                            {todo.task}
                        </Link>
                    </div>
                    <div className="flex justify-center items-center gap-6">
                        <EditCategory id={`${todo._id}`} value={todo.task} handler={handler} />
                        <Delete 
                            id={`${todo._id}`} 
                            label='Delete category' 
                            handler={deleteTodo} 
                            description="Are you sure you want to delete this category? This action will permanently remove all the todos within this category and cannot be undone." 
                        />
                    </div>
                </div>
            ))}
        </>
    );
}

export function TodoTypeSkeleton({ count = 3 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div 
                    key={index} // Using index here since it's a skeleton
                    className="flex w-full justify-between items-center py-5 px-5 bg-[#ffdcbbbb] rounded-xl mb-2"
                >
                    <div className="flex justify-start items-center gap-6 w-full">
                        <Skeleton className="text-2xl w-[calc(100%-40px)] h-14 rounded-xl" />
                    </div>
                    <div className="flex justify-center items-center gap-6">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                </div>
            ))}
        </>
    );
}
