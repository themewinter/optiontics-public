import {cn} from "@/shadcn/lib/utils";

const pulse = "bg-gray-200 animate-pulse rounded";

const EditorSkeleton = () => {
    return (
        <div className="h-screen flex flex-col bg-gray-50 page-container">
            {/* Header — mirrors BuilderHeader */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <div className={cn(pulse, "h-5 w-5")} />
                    <div className={cn(pulse, "h-5 w-36")} />
                    <div className={cn(pulse, "h-4 w-4")} />
                </div>
                <div className={cn(pulse, "h-9 w-52 rounded-md")} />
                <div className="flex items-center gap-2">
                    <div className={cn(pulse, "h-9 w-9 rounded-md")} />
                    <div className={cn(pulse, "h-9 w-28 rounded-md")} />
                    <div className={cn(pulse, "h-9 w-28 rounded-md")} />
                </div>
            </div>

            {/* Body — mirrors opt-builder-layout */}
            <div className="flex flex-1 overflow-hidden opt-builder-layout">
                {/* Canvas area — mirrors EditorCanvas wrapper */}
                <div className="flex-1 flex overflow-hidden relative max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto w-full">
                    <div className="flex flex-col flex-1 min-h-0 px-4 py-4 gap-3">
                        {/* Toolbar — mirrors EditorCanvas top bar */}
                        <div className="flex items-center justify-between flex-shrink-0 bg-white p-3 rounded-xl">
                            <div className="flex items-center border border-gray-200 rounded-lg p-1 gap-0.5">
                                <div className={cn(pulse, "h-7 w-7")} />
                                <div className={cn(pulse, "h-7 w-7")} />
                            </div>
                            <div className={cn(pulse, "h-8 w-24 rounded-lg")} />
                        </div>

                        {/* Card — mirrors the main canvas card */}
                        <div className="bg-white rounded-[10px] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden">
                            <div className="flex flex-1 min-h-0 overflow-hidden">
                                {/* Image column */}
                                <div className="w-[40%] flex-shrink-0 p-4 flex flex-col gap-2 self-start sticky top-0">
                                    <div className={cn(pulse, "w-full aspect-square rounded-lg")} />
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <div key={i} className={cn(pulse, "flex-1 h-7 rounded")} />
                                        ))}
                                    </div>
                                </div>

                                {/* Content column */}
                                <div className="w-[60%] min-w-0 py-4 pr-4 flex flex-col gap-3">
                                    <div className={cn(pulse, "h-5 w-40")} />
                                    <div className={cn(pulse, "h-4 w-20")} />
                                    <div className={cn(pulse, "h-3 w-full")} />
                                    <div className={cn(pulse, "h-3 w-4/5")} />
                                    <div className={cn(pulse, "mt-1 flex-1 min-h-52 rounded-md opacity-40")} />
                                </div>
                            </div>

                            {/* Bottom bar */}
                            <div className="w-[60%] ml-auto flex items-center gap-3 px-4 py-3 border-t border-[#F3F4F6] flex-shrink-0">
                                <div className={cn(pulse, "flex-1 h-9 rounded-lg")} />
                                <div className={cn(pulse, "flex-1 h-9 rounded-lg")} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Control sidebar — mirrors ControlSidebar */}
                <div className="w-[495px] bg-white border border-[#E5E7EB] rounded-md m-4 ml-0 flex flex-col items-center justify-center gap-5 p-8 shrink-0">
                    <div className={cn(pulse, "w-52 h-32 rounded-lg")} />
                    <div className={cn(pulse, "h-6 w-56")} />
                    <div className={cn(pulse, "h-4 w-64")} />
                    <div className={cn(pulse, "h-10 w-36 rounded-lg")} />
                </div>
            </div>
        </div>
    );
};

export default EditorSkeleton;
