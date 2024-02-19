import Image from "next/image";
import Link from "next/link";
import NavigationBar from "./NavigationBar";

export default function Header() {
  return (
    <div className="p-2 bg-zinc-950 flex justify-between border-b border-lime-400 flex justify-between items-center w-full">
      <Link className="flex gap-2 grow-0 items-center" href={"/"}>
        <Image className="shrink-0" width={40} height={30} src={"/logo.png"} alt="logo-icon" />

        <div className="flex flex-col justify-center ">
          <span className="flex md:flex-row flex-col text-xl md:text-2xl">
            <span>Crypto</span>
            <span>Bubbles</span>
          </span>
          <span className="text-gray-500 text-xs hidden md:flex">Price change visualization TOP 250 cryptocurrencies.</span>
        </div>
      </Link>
      <NavigationBar />
    </div>
  );
}
