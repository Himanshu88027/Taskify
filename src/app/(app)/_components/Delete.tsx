import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";
  

interface DeleteProps{
    id: string;
    label: string;
    description: string;
    cross?: string;
    className?: string;
    handler: (id: string) => void;
}

export const Delete = ({
    id,
    label,
    description,
    cross,
    className,
    handler
}: DeleteProps) => {

    return (
        <AlertDialog>
            <AlertDialogTrigger className={cn("bg-[#FF2121] hover:bg-[#d11717] transition-all p-2 drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] rounded-lg text-white", className)}>
                <Cross2Icon className={cn("w-8 h-8", cross)}/>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[500px] max-w-[400px] font-monkey rounded-3xl sm:rounded-3xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-4xl text-red-600">{label}</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-bold text-black">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="w-full flex flex-row justify-between sm:justify-between items-center">
                    <AlertDialogCancel className="bg-[#FF2121] hover:bg-[#18181be6] text-white text-xl rounded-xl py-5">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {handler(id)}} className="bg-[#30C023] text-xl rounded-xl py-5">
                            Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}