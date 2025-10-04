import React from 'react';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
const Page = () => {
    return (
        <main className='bg-black'>
            <Header />
            <Home title="AI PS TECHNOLOGY" paragraph="Welcome to PsAi Chat AI, your intelligent assistant powered by advanced artificial intelligence. Our platform is designed to make communication seamless, whether you’re seeking instant answers, creative ideas, or helpful insights. With PsAi Chat AI, you can chat naturally, explore innovative solutions, and boost productivity like never before. Experience the future of AI-driven conversation—smart, fast, and tailored to your needs" logo="/earthlogo.png" />
            <Footer />
        </main>
    );
}
export default Page;