"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationBar() {
  const pathname = usePathname();
  const isBubblesViewActive = pathname === "/";
  const isTableViewActive = pathname === "/market-info";

  return (
    <ul className="flex gap-2 text-xs">
      <li>
        <Link
          href={"/"}
          className={clsx(
            "gap-1 p-1 border-b-2  flex items-center flex-col text-center bg-zinc-800 cursor-pointer text-white hover:border-lime-500",
            isBubblesViewActive ? "border-lime-500" : "border-zinc-800"
          )}
        >
          <Image width={20} height={20} src={"/bubbles.png"} alt="bubbles-page-icon" />
          <span className="font-bold ">Bubbles view</span>
        </Link>
      </li>
      <li>
        <Link
          href={"/market-info"}
          className={clsx(
            "gap-1 p-1 border-b-2 border-zinc-800 flex items-center flex-col text-center bg-zinc-800 cursor-pointer text-white hover:border-lime-500",
            isTableViewActive ? "border-lime-500" : "border-zinc-800"
          )}
        >
          <Image width={20} height={20} src={"/table.gif"} alt="bubbles-page-icon" />
          <span className="font-bold ">Table view</span>
        </Link>
      </li>
    </ul>
  );
}
