import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function imageUrlToBase64(url: string) {
  try {
    const response = await fetch(url);

    const blob = await response.arrayBuffer();

    const contentType = response.headers.get("content-type");

    const base64String = `data:${contentType};base64,${Buffer.from(
      blob
    ).toString("base64")}`;

    return base64String;
  } catch (err) {
    console.log(err);
  }
}
