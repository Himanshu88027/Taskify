interface ClickableBoxesProps {
  priority: number;
}

export const ClickableBoxes = ({ priority }: ClickableBoxesProps) => {
  // const getBoxColor = (boxPriority: number) => {
  //   if (priority < boxPriority) return 'bg-gray-300';
  //   switch (boxPriority) {
  //     case 1:
  //       return 'bg-green-500';
  //     case 2:
  //       return 'bg-yellow-500';
  //     case 3:
  //       return 'bg-red-500';
  //     default:
  //       return 'bg-gray-300';
  //   }
  // };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
        <div
          className={`w-5 lg:w-8 h-2.5 lg:h-4 rounded-tr-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] ${
            priority >= 1 ? (priority === 1 ? 'bg-green-500' : priority === 2 ? 'bg-yellow-500' : 'bg-red-500') : 'bg-gray-300'
          }`}
        >
        </div>
        <div
          className={`w-5 lg:w-8 h-2.5 lg:h-4 rounded-tr-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] ${
            priority >= 2 ? (priority === 2 ? 'bg-yellow-500' : 'bg-red-500') : 'bg-gray-300'
          }`}
        >
        </div>
        <div
          className={`w-5 lg:w-8 h-2.5 lg:h-4 rounded-tr-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] ${
            priority === 3 ? 'bg-red-500' : 'bg-gray-300'
          }`}
          
        >
      </div>
    </div>
  );
};
