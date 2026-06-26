import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface LikedSongsCoverProps {
  className?: string;
  iconSize?: number;
}

export function LikedSongsCover({ className, iconSize = 28 }: LikedSongsCoverProps){
  return(
    <div className={cn('flex items-center justify-center bg-gradient-to-br from-indigo-400 via-indigo-600 to-white/90 text-white', className)}>
      <Heart className="fill-white" size={iconSize} />
    </div>
  );
}