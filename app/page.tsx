import {Background}  from "@/components/UI/background";
import { Navbar } from "@/components/UI/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" p-16 max-md:px-4 max-md:py-10">
      <Background/>
      <div className="grid grid-flow-col grid-cols-12">
          <div className="col-span-3 w-full">
            <Navbar/>
          </div>
          <div className="col-span-6">

          </div>
          <div className="col-span-3">

          </div>
      </div>
    </div>
  );
}
