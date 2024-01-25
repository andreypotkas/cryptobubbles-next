import React from "react";

export default function Header() {
  return (
    <div className="flex flex-col p-4 bg-zinc-900">
      <div className="flex gap-2 items-center">
        <span className="text-2xl">Crypton</span>
      </div>
      <span className="font-normal text-gray-500 text-sm">
        General info about more than 10000 cryptocurrencies.
      </span>
    </div>
  );
}
