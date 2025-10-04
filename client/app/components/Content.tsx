import Button from '@/app/components/Button';
import { contentProps } from '@/type';
import Image from 'next/image';
import React from 'react';
const Content = ({
    title,
    paragraph,
    background,
    reverse,
    titleButtonOne,
    titleButtonTwo,
}: contentProps) => {
    return (
        <div className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} items-center justify-center text-white w-auto h-auto gap-10`}>
            <div className='flex flex-col items-start justify-start space-y-5'>
                <h1 className='text-blue-600 font-bold text-3xl'>{title}</h1>
                <p className='text-sm font-medium max-w-[80%]'>{paragraph}</p>
                <div className='flex flex-row ml-5 w-full gap-4'>
                    {titleButtonOne && titleButtonOne.length > 0 && (
                        <Button
                            title={titleButtonOne}
                            style='text-white bg-gray-600/40 hover:bg-gray-600/20 duration-300 rounded-xl px-4 py-3'
                            icon=''
                            type='button'
                        />
                    )}
                    {titleButtonTwo && titleButtonTwo.length > 0 && (
                        <Button
                            title={titleButtonTwo + ' ->'}
                            style='text-white hover:bg-gray-600/20 duration-300 rounded-xl px-4 py-3'
                            icon=''
                            type='button'
                        />
                    )}
                </div>
            </div>
            <div className='bg-red-600'>
                <Image src={background} width={800} height={800} alt='background' />
            </div>
        </div>
    );
};
export default Content;