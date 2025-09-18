"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

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
  const [isLoading, setIsLoading] = useState(true);

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

  // Reset loading state when media changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-7xl h-[95vh] p-0 bg-black/70 backdrop-blur-sm border-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">Media viewer</DialogTitle>

        {/* Header với close button và counter */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex-1">{/* Empty space for alignment */}</div>

          {/* Media counter - chỉ hiển thị khi có nhiều media */}
          {mediaList.length > 1 && (
            <div className="flex items-center justify-center flex-1">
              <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/10">
                {currentIndex + 1} / {mediaList.length}
              </div>
            </div>
          )}

          <div className="flex-1 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 transition-all duration-200 rounded-full h-10 w-10 backdrop-blur-sm border border-white/10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation buttons với hiệu ứng đẹp */}
        {mediaList.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute left-6 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 transition-all duration-200 rounded-full h-12 w-12 backdrop-blur-sm border border-white/10 ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
              onClick={onPrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-6 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 transition-all duration-200 rounded-full h-12 w-12 backdrop-blur-sm border border-white/10 ${
                currentIndex === mediaList.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
              onClick={onNext}
              disabled={currentIndex === mediaList.length - 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Media content với hiệu ứng loading */}
        <div className="relative w-full h-full flex items-center justify-center p-8 pt-16 pb-16">
          {mediaList[currentIndex]?.type === "VIDEO" ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                src={mediaList[currentIndex].url}
                controls
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                autoPlay
                playsInline
                key={currentIndex}
                onLoadStart={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
              {/* Play button overlay cho video */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/30 rounded-full p-3 backdrop-blur-sm">
                    <Play className="h-12 w-12 text-white/80" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={mediaList[currentIndex]?.url || ""}
                alt={`Media ${currentIndex + 1}`}
                width={1600}
                height={1200}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                priority
                quality={90}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />

              {/* Loading skeleton */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                  <div className="animate-pulse">
                    <div className="h-12 w-12 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer với media thumbnails */}
        {mediaList.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 p-2 bg-black/50 rounded-xl backdrop-blur-md border border-white/10">
              {mediaList.map((media, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsLoading(true);
                    // You'll need to add a setCurrentIndex prop or handle this differently
                    // For now, this is a placeholder
                  }}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                    currentIndex === index
                      ? "border-white scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {media.type === "VIDEO" ? (
                    <div className="relative w-full h-full">
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
