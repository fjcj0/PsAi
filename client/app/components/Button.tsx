import { buttonProps } from '@/type';
import React from 'react';
const Button = ({ title, style, type = "button", icon }: buttonProps) => {
    return (
        <button type={`${type}`} className={`${style}`}>{title}</button>
    );
}
export default Button;