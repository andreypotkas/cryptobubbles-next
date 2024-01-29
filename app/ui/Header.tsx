import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="p-4 bg-zinc-900 flex justify-between">
      <Link className="flex  gap-2 grow-0" href={"/"}>
        <Image width={50} height={50} src={"/logo.png"} alt="logo-icon" />

        <div className="flex flex-col">
          <span className="text-base md:text-2xl">CryptoBubbles</span>
          <span className="text-gray-500 md:text-sm text-xs">General info about more than 500 cryptocurrencies.</span>
        </div>
      </Link>
      <div></div>
    </div>
  );
}
