"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import {
  EllipsisVerticalIcon,
  UserMinusIcon,
  ShieldExclamationIcon,
  FlagIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { AccountFriendSchemaType } from "@/schemaValidations/friend.schema";
import friendApiRequest from "@/apiRequest/friend";
import { UserIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";

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
    type: "unfriend" | "block" | "report" | null;
    friend: AccountFriendSchemaType | null;
  }>({
    isOpen: false,
    type: null,
    friend: null,
  });

  // Fetch friends on component mount
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const res = await friendApiRequest.getFriendList(
          accountId,
          accessToken
        );
        setFriends(res.payload.data);
      } catch (error) {
        console.log("Error fetching friends:", error);
        toast.error("Đã có lỗi xảy ra khi tải danh sách bạn bè.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [accountId, accessToken]);

  // Filter friends based on search term
  const filteredFriends = friends.filter((friend) =>
    friend.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (
    type: "unfriend" | "block" | "report",
    friend: AccountFriendSchemaType
  ) => {
    setConfirmDialog({
      isOpen: true,
      type,
      friend,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.friend || !confirmDialog.type) return;

    try {
      switch (confirmDialog.type) {
        case "unfriend":
          // await friendApiRequest.unfriend(confirmDialog.friend.id);
          // Remove friend from local state
          setFriends((prev) =>
            prev.filter((f) => f.id !== confirmDialog.friend!.id)
          );
          toast.success(`Đã hủy kết bạn với ${confirmDialog.friend.fullName}`);
          break;
        case "block":
          // await friendApiRequest.block(confirmDialog.friend.id);
          // Remove friend from local state
          setFriends((prev) =>
            prev.filter((f) => f.id !== confirmDialog.friend!.id)
          );
          toast.success(`Đã chặn ${confirmDialog.friend.fullName}`);
          break;
        case "report":
          // await friendApiRequest.report(confirmDialog.friend.id);
          toast.success(`Đã báo cáo ${confirmDialog.friend.fullName}`);
          break;
      }

      setConfirmDialog({ isOpen: false, type: null, friend: null });
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const handleCancelAction = () => {
    setConfirmDialog({ isOpen: false, type: null, friend: null });
  };

  const getDialogContent = () => {
    if (!confirmDialog.friend)
      return {
        title: "",
        description: "",
        confirmText: "",
        variant: "default" as const,
      };

    switch (confirmDialog.type) {
      case "unfriend":
        return {
          title: "Hủy kết bạn",
          description: `Bạn có chắc chắn muốn hủy kết bạn với ${confirmDialog.friend.fullName}?`,
          confirmText: "Hủy kết bạn",
          variant: "destructive" as const,
        };
      case "block":
        return {
          title: "Chặn người dùng",
          description: `Bạn có chắc chắn muốn chặn ${confirmDialog.friend.fullName}? Họ sẽ không thể nhắn tin hoặc tương tác với bạn.`,
          confirmText: "Chặn",
          variant: "destructive" as const,
        };
      case "report":
        return {
          title: "Báo cáo người dùng",
          description: `Bạn có chắc chắn muốn báo cáo ${confirmDialog.friend.fullName}? Chúng tôi sẽ xem xét báo cáo này.`,
          confirmText: "Báo cáo",
          variant: "destructive" as const,
        };
      default:
        return {
          title: "",
          description: "",
          confirmText: "",
          variant: "default" as const,
        };
    }
  };

  const dialogContent = getDialogContent();

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
                      {Math.floor(Math.random() * 200) + 1} bạn chung
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
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleAction("unfriend", friend)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <UserMinusIcon className="h-4 w-4 mr-2" />
                        Hủy kết bạn
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleAction("block", friend)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                        Chặn
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("report", friend)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FlagIcon className="h-4 w-4 mr-2" />
                        Báo cáo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Card Footer with Action Buttons */}
              <div className="px-6 pb-6 pt-2">
                <div className="flex gap-3">
                  {/* Primary Action - Message */}
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                    Nhắn tin
                  </Button>

                  {/* Secondary Action - View Profile */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Hồ sơ
                  </Button>
                </div>
              </div>
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
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>

          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {searchTerm ? "Không tìm thấy kết quả" : "Danh sách bạn bè trống"}
          </h4>

          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
            {searchTerm
              ? `Không có bạn bè nào có tên "${searchTerm}". Hãy thử tìm kiếm với từ khóa khác.`
              : "Bắt đầu kết nối với mọi người xung quanh bạn để xây dựng mạng lưới bạn bè phong phú!"}
          </p>

          {!searchTerm && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Tìm kiếm bạn bè
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Khám phá gợi ý
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={handleCancelAction}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {dialogContent.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {dialogContent.description}
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
            <Button
              variant={dialogContent.variant}
              onClick={handleConfirmAction}
            >
              {dialogContent.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
