"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; 

const InitialComponent = () => {
    const router = useRouter();
    
     useEffect(() => {
    const timer = setTimeout(() => {
        router.push('/fsw-donalds');
    }, 2000); 

    return () => clearTimeout(timer);
    }, [router]);

    return ( 
        <div className="flex flex-col items-center justify-center h-screen">
            <Image
                src={"https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQvcNP9rHlEJu1vCY5kLqzjf29HKaeN78Z6pRy"}
                alt="Logo" width={82} height={82} className="rounded-full mb-5" />
            <h2 className="font-semibold text-xl">Self-Checkout McDonald&apos;s App Like</h2>
        </div>
     );
}
 
export default InitialComponent;