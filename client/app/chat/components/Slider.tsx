import { MoreVertical } from "lucide-react";
import { Trash, ChartBarIcon, List, Settings } from "lucide-react";

const Slider = () => {
    const sections = ['Hello Gemini How Are You', 'Where You From', 'How Could I Be A Programmer'];

    return (
        <div className={`fixed overflow-y-auto w-[18rem] z-50 min-h-[100vh] flex flex-col items-start justify-between
        border-r-2 border-white/10 text-white p-5`} >
            <div className="flex flex-col gap-10 w-full">

                <div className="flex flex-row items-center justify-between">
                    <button className="text-white/50 text-sm hover:text-white duration-300 
                ">
                        <List />
                    </button>
                </div>

                <div className="flex flex-row items-center justify-between w-full">
                    <button className="text-white/50 flex flex-row gap-2 items-center justify-center text-sm hover:text-white duration-300 
                ">
                        <ChartBarIcon />
                        New chat
                    </button>

                    <button className="text-white/50 flex flex-row gap-2 items-center justify-center text-sm hover:text-white duration-300 
                  ">
                        <Trash size={20} />
                        Remove
                    </button>
                </div>

            </div>

            <div className="flex flex-col items-start justify-start gap-4 overflow-y-scroll max-h-[20rem]">
                {
                    sections.map((section, index) => (
                        <div className="text-white/50 hover:bg-white/30 duration-300 p-3 rounded-lg flex items-center text-sm justify-between w-full gap-5" key={index}>
                            <p>{section}</p>
                            <button
                                type="button"
                                className="p-1 hover:bg-white/10 rounded-full transition"
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    ))
                }
            </div>

            <div className="w-full flex items-end justify-end">
                <button className="text-white/50 flex flex-row gap-2 items-center justify-center text-sm hover:text-white duration-300">
                    <Settings />
                    Settings & Help
                </button>

            </div>

        </div>
    );
};

export default Slider;
