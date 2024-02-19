import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="p-2 bg-zinc-900 flex justify-between border-b border-lime-500">
      <Link className="flex  gap-2 grow-0" href={"/"}>
        <Image width={60} height={30} src={"/logo.png"} alt="logo-icon" />

        <div className="flex flex-col justify-center">
          <span className="text-base md:text-2xl">CryptoBubbles</span>
          <span className="text-gray-500 md:text-sm text-xs">General info about top 250 cryptocurrencies.</span>
        </div>
      </Link>
      <div></div>
    </div>
  );
}
