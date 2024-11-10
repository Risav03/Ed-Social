import { Dashboard } from "@/components/Dashboard/dashboard";
import { Background } from "@/components/UI/background";
import { Navbar } from "@/components/Navbar/navbar";
import { SearchBar } from "@/components/Search/searchBar";

export default function Profile() {
    return (
        <div className="max-w-[150rem] px-16 max-md:px-0 h-screen overflow-hidden">
            <Background />
            <div className="flex h-full justify-center max-md:pb-20">
                <div className="md:w-60 max-md:absolute bottom-0">
                    <Navbar />
                </div>
                <div className="md:w-[40rem] h-full overflow-y-auto no-scr">
                    <Dashboard/>
                </div>
                <div className="md:w-60 border-l-[2px] border-slate-400/20 max-md:hidden">
                    <SearchBar/>
                </div>
            </div>
        </div>
    )
}