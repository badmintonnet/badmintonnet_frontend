"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditClubForm from "./edit-club-form";
import { ClubResType } from "@/schemaValidations/clubs.schema";

interface EditClubButtonProps {
  clubDetail: ClubResType["data"];
  token: string;
}

const EditClubButton: React.FC<EditClubButtonProps> = ({
  clubDetail,
  token,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button
        variant="outline"
        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={handleOpen}
      >
        <Edit className="h-4 w-4 mr-1" /> Chỉnh sửa CLB
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[90vw] md:!max-w-4xl !w-full max-h-[90vh] overflow-y-auto p-0">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">
                Chỉnh sửa câu lạc bộ
              </DialogTitle>
            </DialogHeader>
            <EditClubForm
              clubDetail={clubDetail}
              token={token}
              onClose={handleClose}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditClubButton;
