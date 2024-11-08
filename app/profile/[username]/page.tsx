import { Dashboard } from "@/components/Dashboard/dashboard";
import { Background } from "@/components/UI/background";
import { Navbar } from "@/components/Navbar/navbar";
import { SearchBar } from "@/components/Search/searchBar";

export default function Profile() {
    return (
        <div className="max-w-[150rem] px-16 max-md:px-4 overflow-hidden">
            <Background />
            <div className="flex justify-center">
                <div className="w-60">
                    <Navbar />
                </div>
                <div className="w-[40rem] overflow-y-scroll no-scr">
                    <Dashboard/>
                </div>  
                <div className="w-60 border-l-[2px] border-slate-400/20">
                    <SearchBar/>
                </div>
            </div>
        </div>
    )
}