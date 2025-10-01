import Image from "next/image";
const Messages = () => {
    const images = ['/logoman.png', '/logowoman.png', '/Morgan.png', '/earthlogo.png']
    return (
        <div>
            <div className="w-full flex flex-col items-center justify-center gap-5 text-center px-4">
                <h1 className="text-5xl font-bold text-white">
                    Hello Jack To{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-500/80 to-white">
                        PsAi
                    </span>
                </h1>
                <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
                    Ask anything — we’re here to help you. Whether it’s coding, design, or problem-solving,
                    just type your question below and we’ll get started right away.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-9 my-4">
                    {
                        images.map((image, index) => (
                            <Image key={index} src={image} alt="logo" width={400} height={400}
                                className="rounded-3xl hover:scale-110 duration-300" />
                        ))
                    }

                </div>
            </div>

            {/*If there are messages*/}
            <div></div>
        </div>
    );
};
export default Messages;
