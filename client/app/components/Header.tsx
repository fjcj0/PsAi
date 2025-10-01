import Image from "next/image";
import React from "react";
import Button from "./button";

const Header = () => {
    return (
        <div className="w-full flex items-center justify-between px-20 py-6">
            <Image src={'/earthlogo.png'} alt="earthlogo" width={110} height={110}
                className="rounded-full" />
            <Button style={`text-white font-bold bg-blue-700 px-5 py-3 rounded-lg
            hover:bg-blue-900 duration-300`} title={`Sign In`}
                type={'button'} icon={''} />
        </div>
    );
};

export default Header;