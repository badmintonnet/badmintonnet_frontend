"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EllipsisVerticalIcon, UserMinusIcon, UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { AccountFriendSchemaType } from "@/schemaValidations/friend.schema";
import friendApiRequest from "@/apiRequest/friend";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface FriendTabProps {
  accountId: string;
  accessToken: string;
}

export default function FriendList({ accountId, accessToken }: FriendTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState<AccountFriendSchemaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    friend: AccountFriendSchemaType | null;
  }>({
    isOpen: false,
    friend: null,
  });

  // Fetch friends on component mount
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const res = await friendApiRequest.getFriendList(
          accountId,
          accessToken,
        );
        setFriends(res.payload.data ?? []);
      } catch (error) {
        console.error(error);
        toast.error("Đã có lỗi xảy ra khi tải danh sách bạn bè.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [accountId, accessToken]);

  // Filter friends based on search term
  const filteredFriends = friends.filter((friend) =>
    friend.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleActionUnfriend = (friend: AccountFriendSchemaType) => {
    setConfirmDialog({ isOpen: true, friend });
  };

  const handleConfirmUnfriend = async () => {
    if (!confirmDialog.friend) return;
    try {
      // uncomment / adapt API call if available:
      await friendApiRequest.unfriend(confirmDialog.friend.id);
      setFriends((prev) =>
        prev.filter((f) => f.id !== confirmDialog.friend!.id),
      );
      toast.success(`Đã hủy kết bạn với ${confirmDialog.friend.fullName}`);
      setConfirmDialog({ isOpen: false, friend: null });
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const handleCancelAction = () =>
    setConfirmDialog({ isOpen: false, friend: null });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500">Đang tải danh sách bạn bè...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <UsersIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Bạn bè
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {friends.length} người bạn
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-80 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Friends Grid */}
      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Card Header with Avatar */}
              <div className="relative p-6 pb-4">
                <div className="flex items-center gap-4">
                  {/* Avatar with Online Status */}
                  <div className="relative flex-shrink-0">
                    <Link
                      href={`/profile/${friend.slug}`}
                      rel="noopener noreferrer"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800 cursor-pointer hover:ring-blue-500 transition-all duration-200">
                        <Image
                          src={friend.avatarUrl || "/user.png"}
                          alt={friend.fullName}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </Link>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>

                  {/* Friend Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profile/${friend.slug}`}
                      rel="noopener noreferrer"
                      className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {friend.fullName}
                      </h4>
                    </Link>
                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                      {friend.skillLevel || "Chưa có"}
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      {friend.mutualFriends} bạn chung
                    </p>
                  </div>

                  {/* Quick Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => handleActionUnfriend(friend)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <UserMinusIcon className="h-4 w-4 mr-2" />
                        Hủy kết bạn
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Card Footer with Action Buttons */}
            </div>
          ))}
        </div>
      ) : (
        /* Enhanced Empty State */
        <div className="text-center py-16">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <UsersIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {searchTerm ? "Không tìm thấy kết quả" : "Danh sách bạn bè trống"}
          </h4>

          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
            {searchTerm
              ? `Không có bạn bè nào có tên "${searchTerm}".`
              : "Bắt đầu kết nối với mọi người xung quanh bạn để xây dựng mạng lưới bạn bè!"}
          </p>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={handleCancelAction}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Hủy kết bạn
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Bạn có chắc chắn muốn hủy kết bạn với{" "}
              {confirmDialog.friend?.fullName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelAction}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmUnfriend}>
              Hủy kết bạn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
