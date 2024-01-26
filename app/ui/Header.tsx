import Image from "next/image";

export default function Header() {
  return (
    <div className="flex p-4 bg-zinc-900 items-center gap-2">
      <Image width={50} height={50} src={"/logo.png"} alt="logo-icon" />

      <div className="flex flex-col">
        <span className="text-base	 md:text-2xl">CryptoBubbles</span>
        <span className="text-gray-500 md:text-sm text-xs">General info about more than 10000 cryptocurrencies.</span>
      </div>
    </div>
  );
}
