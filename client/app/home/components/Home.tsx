import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Content from './Content';
const Home = ({ title, paragraph, logo }: homeProps) => {
    return (
        <div className='w-full h-full flex flex-col items-center justify-between'>
            <div className='w-full text-center flex flex-col items-center justify-center my-16 space-y-5'>
                <h1 className="md:text-6xl text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white/50 via-blue-500/80 to-slate-800">
                    {title}
                </h1>
                <p className='lg:max-w-[40%] max-w-[95%]  text-white text-sm'>
                    {paragraph}
                </p>
                <Link href={'/chat'} className='font-bold text-white
            bg-blue-600 px-5 py-2 rounded-lg
            hover:bg-blue-900 duration-300'>
                    Let's go
                </Link>
            </div>

            <div className='max-w-2xl p-5 flex flex-col items-center  justify-center gap-11'>
                <Content title={'Our vision for the future of AI'}
                    paragraph={'Our mission is to ensure that artificial general intelligence—AI systems that are generally smarter than humans—benefits all of humanity'}
                    background={'/logowoman.png'} reverse={false}
                    titleButtonOne={'Our plan for AI'}
                    titleButtonTwo={'Our Charter'} />
                <Content title={'What We Are Building'}
                    paragraph={'We are building safe and beneficial AGI, but will also consider our mission fulfilled if our work aids others to achieve this outcome'}
                    background={'/Morgan.png'} reverse={true}
                    titleButtonOne={''}
                    titleButtonTwo={''} />
            </div>
        </div>
    );
}
export default Home;