import { Background } from "@/components/UI/background";
import { Navbar } from "@/components/Navbar/navbar";
import { Timeline } from "@/components/Timeline/timeline";
import { SearchBar } from "@/components/Search/searchBar";

export default function Home() {
    return (
        <div className="max-w-[150rem] px-16 max-md:px-4 h-screen overflow-hidden">
            <Background />
            <div className="flex h-full justify-center">
                <div className="w-60 ">
                    <Navbar />
                </div>
                <div className="w-[40rem] h-full overflow-y-auto no-scr">
                    <Timeline/>
                </div>
                <div className="w-60 border-l-[2px] border-slate-400/20">
                    <SearchBar/>
                </div>
            </div>
        </div>
    );
}