"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import EditEventModal from "./edit-event-form";
import { EventDetailResponseType } from "@/schemaValidations/event.schema";

interface EditEventButtonProps {
  eventData: EventDetailResponseType["data"];
}

export default function EditEventButton({ eventData }: EditEventButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button
        onClick={openModal}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Edit3 className="w-4 h-4 mr-2" />
        Chỉnh sửa sự kiện
      </Button>

      <EditEventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        eventData={eventData}
      />
    </>
  );
}
