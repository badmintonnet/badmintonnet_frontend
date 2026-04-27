"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import tournamentApiRequest from "@/apiRequest/tournament";
import { toast } from "sonner";
import { AccountFriendSchemaType } from "@/schemaValidations/friend.schema";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function SelectPartnerModal({
  categoryId,
}: {
  categoryId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<AccountFriendSchemaType[]>([]);

  // popup nhập message
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [selectedPartner, setSelectedPartner] =
    useState<AccountFriendSchemaType | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await tournamentApiRequest.getPartnerList(categoryId);
        setPartners(res.payload.data);
      } catch {
        toast.error("Không thể tải danh sách người chơi");
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      fetchPartner();
    }
  }, [open, categoryId]);

  const openMessageModal = (p: AccountFriendSchemaType) => {
    setSelectedPartner(p);
    setOpenMessageBox(true);
  };

  const sendInvite = () => {
    if (!selectedPartner) return;
    tournamentApiRequest.invitePartner({
      inviteeId: selectedPartner.id,
      categoryId: categoryId,
      message: message,
    });
    setSelectedPartner(null);

    setMessage("");
    setOpenMessageBox(false);
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      {/* Modal chọn partner */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="rounded-xl">
            Mời đồng đội
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Chọn người để mời ghép đôi
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="text-center py-6">Đang tải...</div>
          ) : partners.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-semibold">
                Không có đối tác nào hoặc có thể bạn của bạn đã có người mới
              </p>
              <p className="text-sm mt-1">
                Hãy kết bạn thêm để mời tham gia nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition-all bg-white dark:bg-gray-900"
                >
                  <Image
                    src={p.avatarUrl || "/default-avatar.png"}
                    width={50}
                    height={50}
                    alt="avatar"
                    className="rounded-full h-12 w-12 object-cover"
                  />

                  <div className="flex-1">
                    <Link
                      href={`/profile/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      <p className="font-semibold">{p.fullName}</p>
                    </Link>

                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <Badge variant="secondary">{p.skillLevel}</Badge>
                      <span className="text-xs">
                        {p.mutualFriends} bạn chung
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => openMessageModal(p)}
                    className="rounded-lg"
                  >
                    Mời
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal soạn message */}
      <Dialog open={openMessageBox} onOpenChange={setOpenMessageBox}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Gửi lời mời ghép đôi
            </DialogTitle>
            {selectedPartner && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gửi tới: <strong>{selectedPartner.fullName}</strong>
              </p>
            )}
          </DialogHeader>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập lời nhắn (không bắt buộc)..."
            className="min-h-[100px]"
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpenMessageBox(false)}
              className="rounded-lg"
            >
              Hủy
            </Button>

            <Button onClick={sendInvite} className="rounded-lg">
              Gửi lời mời
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
