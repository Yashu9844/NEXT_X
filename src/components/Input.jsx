"use client"

import { useSession } from "next-auth/react"


const Input = () => {
    const {data:session} = useSession();

if(!session) return null;
return <div className="">Input</div>
}

export default Input
