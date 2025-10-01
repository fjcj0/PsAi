import React from 'react';
import { Image, Send } from 'lucide-react';
const Input = () => {
    return (
        <div className='w-full flex flex-row px-3 py-4 rounded-xl justify-between text-white/30 bg-slate-700/20'>
            <input type="text" className='w-[70%] bg-transparent text-sm outline-none placeholder:text-white/30
            placeholder:text-sm'
                placeholder='Ask us anything in your mind....' />
            <div className='flex flex-row gap-3'>
                <button type='button' className='hover:text-white duration-300'>
                    <Image size={20} />
                </button>
                <button type='button' className='hover:text-white duration-300'>
                    <Send size={20} />
                </button>

            </div>
        </div>
    );
}
export default Input;