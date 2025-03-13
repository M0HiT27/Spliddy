import { useEffect, useState } from "react";

interface ErrorMessageProps {
    message: string;
    errorSetter: React.Dispatch<React.SetStateAction<string>>;
    isError: boolean;
}

export default function MessagePopup({ message, errorSetter, isError }: ErrorMessageProps) {
    const [isVisible, setisVisible] = useState<boolean>(true);
    function makeInvisible() {
        setisVisible(false);
    }
    useEffect(() => {
        setTimeout(() => {
            errorSetter("");
            makeInvisible();
        }, 5000);
    }, [])

    if (isError) {
        return (
            <div className={`${isVisible ? 'block' : 'hidden'}  fixed z-10 text text-white top-[85%] right-[5%]  bg-errorColor p-2 px-4 rounded-2xl border-3 border-red-900`}>
                {message}
            </div>
        );

    } else {
        return (
            <div className={`${isVisible ? 'block' : 'hidden'}  fixed z-10 text text-white top-[85%] right-[5%]  bg-green-700 p-2 px-4 rounded-2xl border-3 border-green-900`}>
                {message}
            </div>
        );
    }
}