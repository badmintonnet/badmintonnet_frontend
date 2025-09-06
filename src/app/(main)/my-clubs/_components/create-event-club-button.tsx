import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CreateEventClubButton = ({
  className = "",
  club,
}: {
  className?: string;
  club: string;
}) => {
  return (
    <Button
      asChild
      variant="default"
      className={`bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white ${className}`}
    >
      <Link href={`/my-clubs/create-event?club=${club}`}>
        <Plus className="h-4 w-4 mr-1" />
        Tạo hoạt động
      </Link>
    </Button>
  );
};
