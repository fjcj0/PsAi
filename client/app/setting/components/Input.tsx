import { inputSettingProps } from '@/type';
import React, { FC } from 'react';
const Input: FC<inputSettingProps> = ({ type, placeholder, isActive, text, setText }) => {
    return (
        <div className="flex flex-col gap-2">
            <input
                type={type}
                placeholder={placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!isActive}
                className={`w-full p-3 rounded-md outline-none ${isActive
                    ? 'bg-black/10 text-white/50 focus:outline focus:outline-white/25'
                    : 'bg-white/20 text-white placeholder-white/50 border-[0.5px] border-white'
                    }`}
            />
        </div>
    );
};
export default Input;