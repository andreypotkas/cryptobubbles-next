import Image from "next/image";

export default function Header() {
  return (
    <div className="flex p-4 bg-zinc-900 gap-2">
      <Image width={50} height={50} src={"/logo.png"} alt="logo-icon" />

      <div className="flex flex-col">
        <span className="text-2xl">CryptoBubbles</span>
        <span className="font-normal text-gray-500 text-sm">
          General info about more than 10000 cryptocurrencies.
        </span>
      </div>
    </div>
  );
}
