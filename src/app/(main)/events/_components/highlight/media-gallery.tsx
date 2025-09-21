"use client";

import MediaModal from "@/app/(main)/events/_components/highlight/media-modal";
import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MediaItem {
  url: string;
  type: "IMAGE" | "VIDEO";
}

interface MediaGalleryProps {
  mediaList: MediaItem[];
}

export default function MediaGallery({ mediaList }: MediaGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextMedia = () => {
    if (currentIndex < mediaList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!mediaList || mediaList.length === 0) return null;

  // Single media
  if (mediaList.length === 1) {
    return (
      <>
        <div
          className="mt-3 cursor-pointer rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => openModal(0)}
        >
          <div className="relative w-full h-[400px]">
            {mediaList[0].type === "VIDEO" ? (
              <>
                <video
                  src={mediaList[0].url}
                  className="w-full h-full object-cover"
                  poster=""
                />

                {/* Overlay với gradient */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Play button */}
                  <div className="relative group-hover:scale-110 transition-all duration-300 ease-out">
                    {/* Button */}
                    <div className="relative w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/80 group-hover:bg-black/40 group-hover:scale-105 transition-all duration-300">
                      <Play
                        size={20}
                        fill="white"
                        className="h-5 w-5 text-white ml-0.5 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Image
                src={mediaList[0].url}
                alt="Highlight media"
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
                priority
                sizes="100vw"
              />
            )}
          </div>
        </div>
        <MediaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mediaList={mediaList}
          onNext={nextMedia}
          onPrev={prevMedia}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </>
    );
  }

  // Two media items
  if (mediaList.length === 2) {
    return (
      <>
        <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {mediaList.map((media, index) => (
            <div
              key={index}
              className="relative h-[400px] cursor-pointer group"
              onClick={() => openModal(index)}
            >
              {media.type === "VIDEO" ? (
                <>
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    poster=""
                  />
                  {/* Overlay với gradient và play button giống single */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative group-hover:scale-110 transition-all duration-300 ease-out">
                      <div className="relative w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/80 group-hover:bg-black/40 group-hover:scale-105 transition-all duration-300">
                        <Play
                          size={20}
                          fill="white"
                          className="h-5 w-5 text-white ml-0.5 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Image
                  src={media.url}
                  alt={`Media ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
          ))}
        </div>
        <MediaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mediaList={mediaList}
          onNext={nextMedia}
          onPrev={prevMedia}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </>
    );
  }

  // Three media items
  if (mediaList.length === 3) {
    return (
      <>
        <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div
            className="relative h-[400px] cursor-pointer group"
            onClick={() => openModal(0)}
          >
            {mediaList[0].type === "VIDEO" ? (
              <>
                <video
                  src={mediaList[0].url}
                  className="w-full h-full object-cover"
                  poster=""
                />
                {/* Overlay với gradient và play button giống single */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative group-hover:scale-110 transition-all duration-300 ease-out">
                    <div className="relative w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/80 group-hover:bg-black/40 group-hover:scale-105 transition-all duration-300">
                      <Play
                        size={20}
                        fill="white"
                        className="h-5 w-5 text-white ml-0.5 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Image
                src={mediaList[0].url}
                alt="Media 1"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
          <div className="grid grid-rows-2 gap-0.5">
            {mediaList.slice(1, 3).map((media, index) => (
              <div
                key={index + 1}
                className="relative h-[197px] cursor-pointer group"
                onClick={() => openModal(index + 1)}
              >
                {media.type === "VIDEO" ? (
                  <>
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      poster=""
                    />
                    {/* Overlay với gradient và play button giống single */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative group-hover:scale-110 transition-all duration-300 ease-out">
                        <div className="relative w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/80 group-hover:bg-black/40 group-hover:scale-105 transition-all duration-300">
                          <Play
                            size={16}
                            fill="white"
                            className="h-4 w-4 text-white ml-0.5 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Image
                    src={media.url}
                    alt={`Media ${index + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <MediaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mediaList={mediaList}
          onNext={nextMedia}
          onPrev={prevMedia}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </>
    );
  }

  // Four or more media items
  return (
    <>
      <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {mediaList.slice(0, 4).map((media, index) => (
          <div
            key={index}
            className="relative h-[197px] cursor-pointer group"
            onClick={() => openModal(index)}
          >
            {media.type === "VIDEO" ? (
              <>
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  poster=""
                />
                {/* Overlay với gradient và play button giống single */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative group-hover:scale-110 transition-all duration-300 ease-out">
                    <div className="relative w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/80 group-hover:bg-black/40 group-hover:scale-105 transition-all duration-300">
                      <Play
                        size={16}
                        fill="white"
                        className="h-4 w-4 text-white ml-0.5 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Image
                src={media.url}
                alt={`Media ${index + 1}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            )}
            {/* Show overlay for 4th image if there are more than 4 images */}
            {index === 3 && mediaList.length > 4 && (
              <div className="absolute inset-0 flex items-center justify-center transition-all duration-200">
                <span className="text-white text-2xl font-bold">
                  +{mediaList.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <MediaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mediaList={mediaList}
        onNext={nextMedia}
        onPrev={prevMedia}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </>
  );
}
