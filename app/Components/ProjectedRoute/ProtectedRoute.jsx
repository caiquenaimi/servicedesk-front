'use client'
import { useEffect, useContext } from "react";
import { UserContext } from "@/app/contexts/userContext";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({children}) => {
    const { user } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if(!user) {
            router.replace('/Login');
        }
    }, [router, user]);

    if(!user) return null;

    return <>{children}</>
}

export default ProtectedRoute;