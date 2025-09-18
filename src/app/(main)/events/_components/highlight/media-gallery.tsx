"use client";

import MediaModal from "@/app/(main)/events/_components/highlight/media-modal";
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
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index: number) => {
    setSelectedMedia(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  const nextMedia = () => {
    if (selectedMedia !== null && selectedMedia < mediaList.length - 1) {
      setSelectedMedia(selectedMedia + 1);
    }
  };

  const prevMedia = () => {
    if (selectedMedia !== null && selectedMedia > 0) {
      setSelectedMedia(selectedMedia - 1);
    }
  };

  if (!mediaList || mediaList.length === 0) return null;

  // Single media
  if (mediaList.length === 1) {
    return (
      <>
        <div
          className="mt-3 cursor-pointer rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          onClick={() => openModal(0)}
        >
          <div className="relative w-full h-[400px]">
            {mediaList[0].type === "VIDEO" ? (
              <video
                src={mediaList[0].url}
                className="w-full h-full object-cover"
                poster=""
              />
            ) : (
              <Image
                src={mediaList[0].url}
                alt="Highlight media"
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
              />
            )}
          </div>
        </div>
        <MediaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mediaList={mediaList}
          currentIndex={selectedMedia || 0}
          onNext={nextMedia}
          onPrev={prevMedia}
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
              className="relative h-[250px] cursor-pointer group"
              onClick={() => openModal(index)}
            >
              {media.type === "VIDEO" ? (
                <video
                  src={media.url}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  poster=""
                />
              ) : (
                <Image
                  src={media.url}
                  alt={`Media ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              )}
            </div>
          ))}
        </div>
        <MediaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mediaList={mediaList}
          currentIndex={selectedMedia || 0}
          onNext={nextMedia}
          onPrev={prevMedia}
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
            className="relative h-[330px] cursor-pointer group"
            onClick={() => openModal(0)}
          >
            {mediaList[0].type === "VIDEO" ? (
              <video
                src={mediaList[0].url}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                poster=""
              />
            ) : (
              <Image
                src={mediaList[0].url}
                alt="Media 1"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            )}
          </div>
          <div className="grid grid-rows-2 gap-0.5">
            {mediaList.slice(1, 3).map((media, index) => (
              <div
                key={index + 1}
                className="relative h-[162px] cursor-pointer group"
                onClick={() => openModal(index + 1)}
              >
                {media.type === "VIDEO" ? (
                  <video
                    src={media.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    poster=""
                  />
                ) : (
                  <Image
                    src={media.url}
                    alt={`Media ${index + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
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
          currentIndex={selectedMedia || 0}
          onNext={nextMedia}
          onPrev={prevMedia}
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
            className="relative h-[162px] cursor-pointer group"
            onClick={() => openModal(index)}
          >
            {media.type === "VIDEO" ? (
              <video
                src={media.url}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                poster=""
              />
            ) : (
              <Image
                src={media.url}
                alt={`Media ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            )}
            {/* Show overlay for 4th image if there are more than 4 images */}
            {index === 3 && mediaList.length > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center group-hover:bg-opacity-50 transition-all duration-200">
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
        currentIndex={selectedMedia || 0}
        onNext={nextMedia}
        onPrev={prevMedia}
      />
    </>
  );
}
