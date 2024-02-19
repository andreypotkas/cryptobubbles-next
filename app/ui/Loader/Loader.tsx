import clsx from "clsx";
import Image from "next/image";
import "./Loader.scss";

export default function Loader() {
  return (
    <div className="loading-spinner" data-testid="loading-spinner">
      <div className={clsx("loading-spinner-content", "border rounded border-zinc-800")}>
        <h3 className="text-2xl">Loading data</h3>
        <p>It can take some time to first load..</p>
        <div className="w-full flex justify-center items-center mt-8 animate-bounce ">
          <Image src={"/logo.png"} alt={"logo"} width={100} height={100} />
        </div>
      </div>
    </div>
  );
}
