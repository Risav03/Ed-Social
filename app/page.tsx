import { Dashboard } from "@/components/Dashboard/dashboard";
import { Background } from "@/components/UI/background";
import { Navbar } from "@/components/UI/navbar";

export default function Profile() {
    return (
        <div className="max-w-[150rem] p-16 max-md:px-4 max-md:py-10">
            <Background />
            <div className="flex justify-center">
                <div className="w-60">
                    <Navbar />
                </div>
                <div className="w-[50rem]">

                </div>  
                <div className="w-60">

                </div>
            </div>
        </div>
    )
}