"use client";
import { useEffect, useState } from "react";
import useSlideStore from "@/store/slideStore";
import { MoreVertical, Trash, MessageCircle, List, Settings, XIcon } from "lucide-react";
import { useMessage } from "@/app/context/MessageContext";
const Slider = () => {
    const { setConversation, conversation } = useMessage();
    const [mounted, setMounted] = useState(false);
    const { isSlideOpen, toggleSlide } = useSlideStore();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const conversations = [
        "Hello Gemini How Are You",
        "Where You From",
        "How Could I Be A Programmer",
        "Learning JavaScript Basics",
        "Understanding CSS Flexbox",
        "Mastering HTML5 Tags",
        "Building Responsive Layouts",
        "Introduction to React",
        "State Management in React",
        "Routing in Single Page Apps",
        "JavaScript ES6 Features",
        "Debugging JavaScript Code",
        "Async Programming with Promises",
        "Working with APIs",
        "Handling Form Inputs",
        "Storing Data in LocalStorage",
        "Understanding Closures",
        "Working with Arrays",
        "Object-Oriented JavaScript",
        "Functional Programming Concepts",
        "Event Handling in DOM",
        "Animating with CSS",
        "Using Fetch API",
        "Error Handling Techniques",
        "Version Control with Git",
        "Deploying Web Apps",
        "Node.js Basics",
        "Express.js Routing",
        "MongoDB Integration",
        "Building RESTful APIs"
    ];
    useEffect(() => {
        setMounted(true);
    }, []);
    const handleDelete = (index: number) => {
        setActiveIndex(null);
    };
    const onChangeConversation = (index: number) => {
        setConversation(conversations[index]);
    };
    const onClickNewChat = () => {
        setConversation(null);
    };
    if (!mounted) return null;
    return (
        <div
            className={`fixed top-0 left-0 h-screen overflow-y-auto transition-all duration-300 z-10 flex flex-col justify-between bg-slate-950 md:bg-slate-800/20 text-white
    ${isSlideOpen ? "w-[15rem]" : "w-0"} 
    ${isSlideOpen ? "md:w-[15rem]" : "md:w-[5rem]"}
  `}
        >
            <div className={`md:hidden z-50 text-white/50 text-sm hover:text-white duration-300 top-[3.5rem] left-[1.5rem] ${isSlideOpen ? 'hidden' : 'fixed'}`}>
                <button onClick={toggleSlide}>
                    <List />
                </button>
            </div>
            <div className="flex flex-col gap-10 w-full p-5">
                <div className="flex items-center justify-between">
                    <button
                        className="text-white/50 text-sm hover:text-white duration-300"
                        onClick={toggleSlide}
                    >
                        {!isSlideOpen ? <List /> : <XIcon />}
                    </button>
                </div>
                <div className="flex items-center justify-between w-full">
                    <button type="button" onClick={onClickNewChat} className="text-white/50 flex items-center gap-2 text-sm hover:text-white duration-300">
                        <MessageCircle />
                        <span className={`${isSlideOpen ? "inline" : "hidden"} duration-300`}>New chat</span>
                    </button>
                    <button
                        className={`text-white/50 gap-2 text-sm hover:text-white duration-300 ${isSlideOpen ? "flex items-center" : "hidden"}`}
                    >
                        <Trash size={20} />
                        Remove
                    </button>
                </div>
            </div>
            <div className={`gap-4 overflow-y-scroll max-h-[40rem] mt-5 ${isSlideOpen ? "flex flex-col" : "hidden"} p-5`}>
                {conversations.map((conv, index) => (
                    <div
                        key={index}
                        className="text-white/50 hover:bg-white/30 duration-300 p-3 rounded-lg flex justify-between items-center gap-5 text-sm w-full cursor-pointer"
                        onClick={() => onChangeConversation(index)}
                    >
                        <p>{conv}</p>
                        <div className="relative">
                            <button
                                className="p-1 hover:bg-white/10 rounded-full transition"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveIndex(activeIndex === index ? null : index);
                                }}
                            >
                                <MoreVertical size={18} />
                            </button>
                            {activeIndex === index && (
                                <div className="absolute right-0 top-full mt-1 w-24 bg-slate-900 rounded-md shadow-lg z-20">
                                    <button
                                        className="flex items-center gap-2 w-full p-2 text-sm text-white/40 transition rounded-md hover:bg-slate-950 hover:text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(index);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex justify-end mt-auto p-5">
                <button
                    onClick={() => window.location.href = '/setting'}
                    className="text-white/50 flex items-center gap-2 text-sm hover:text-white duration-300">
                    <Settings />
                    <span className={`${isSlideOpen ? "inline" : "hidden"} duration-300`}>Settings & Help</span>
                </button>
            </div>
        </div>
    );
};
export default Slider;