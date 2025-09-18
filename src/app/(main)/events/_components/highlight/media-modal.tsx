"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect } from "react";

interface MediaItem {
  url: string;
  type: "IMAGE" | "VIDEO";
}

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: MediaItem[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function MediaModal({
  isOpen,
  onClose,
  mediaList,
  currentIndex,
  onNext,
  onPrev,
}: MediaModalProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) onPrev();
          break;
        case "ArrowRight":
          if (currentIndex < mediaList.length - 1) onNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, mediaList.length, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black border-0">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 transition-colors duration-200"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation buttons */}
          {mediaList.length > 1 && (
            <>
              {currentIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 transition-colors duration-200"
                  onClick={onPrev}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}

              {currentIndex < mediaList.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 transition-colors duration-200"
                  onClick={onNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}
            </>
          )}

          {/* Media content */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {mediaList[currentIndex]?.type === "VIDEO" ? (
              <video
                src={mediaList[currentIndex].url}
                controls
                className="max-w-full max-h-full object-contain rounded-lg"
                autoPlay
                key={currentIndex} // Force remount when changing videos
              />
            ) : (
              <div className="relative max-w-full max-h-full">
                <Image
                  src={mediaList[currentIndex]?.url || ""}
                  alt={`Media ${currentIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  priority
                />
              </div>
            )}
          </div>

          {/* Media counter */}
          {mediaList.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              {currentIndex + 1} / {mediaList.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
