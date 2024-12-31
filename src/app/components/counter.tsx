"use client"

import {useState} from "react";

import {useAuth, useUser} from "@clerk/nextjs";

export const Counter = () => {

    // const {isLoaded, userId, sessionId, getToken} = useAuth();
    const {isLoaded, isSignedIn, user} = useUser();


    const [count, setCount] = useState(0);

    // if (!isLoaded || !userId) {
    //     return null;
    // }

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    console.log("Counter Component, count = ", count);

    return (
        <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
    );
};