import { Dashboard } from "@/components/Dashboard/dashboard";
import { Background } from "@/components/UI/background";
import { Navbar } from "@/components/Navbar/navbar";

export default function Profile() {
    return (
        <div className="max-w-[150rem] px-16 max-md:px-4 ">
            <Background />
            <div className="flex justify-center">
                <div className="w-60">
                    <Navbar />
                </div>
                <div className="w-[40rem]">
                    <Dashboard/>
                </div>  
                <div className="w-60">

                </div>
            </div>
        </div>
    )
}