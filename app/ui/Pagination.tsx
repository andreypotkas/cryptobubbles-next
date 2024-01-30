import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Pagination({ page }: { page: string }) {
  return (
    <div className="flex gap-2 items-center">
      <Button disabled={+page <= 1} variant="outline" size="icon">
        <Link href={`/?page=${+page - 1}`}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div className="w-6 text-center"> {page}</div>
      <Button disabled={+page >= 6} variant="outline" size="icon">
        <Link href={`/?page=${+page + 1}`}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
