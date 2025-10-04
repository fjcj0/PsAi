import React from 'react';
import Messages from './components/Messages';
import Input from './components/Input';

const Page = () => {
    return (
        <div className='w-full flex flex-col items-center justify-end h-full'>
            <div className='flex-1 overflow-y-auto scrollbar-hide p-10 w-full'>
                <Messages />
            </div>
            <div className='p-5 w-full'>
                <Input />
            </div>
        </div>
    )
}

export default Page;
