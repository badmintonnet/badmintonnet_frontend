"use client";
import { useState } from "react";
import { EventParticipantStatus } from "@/schemaValidations/event.schema";
import eventClubApiRequest from "@/apiRequest/club.event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Map với labels và colors
const statusConfig: Record<
  EventParticipantStatus,
  { label: string; color: string; bgColor: string; darkBgColor: string }
> = {
  ATTENDED: {
    label: "Có mặt",
    color: "text-green-700 dark:text-green-300",
    bgColor: "bg-green-50 border-green-200",
    darkBgColor: "dark:bg-green-950 dark:border-green-800",
  },
  ABSENT: {
    label: "Vắng mặt",
    color: "text-red-700 dark:text-red-300",
    bgColor: "bg-red-50 border-red-200",
    darkBgColor: "dark:bg-red-950 dark:border-red-800",
  },
  PENDING: { label: "", color: "", bgColor: "", darkBgColor: "" },
  APPROVED: { label: "", color: "", bgColor: "", darkBgColor: "" },
  CANCELLED: { label: "", color: "", bgColor: "", darkBgColor: "" },
};

interface AttendanceDropdownProps {
  eventId: string;
  participantId: string;
  value?: EventParticipantStatus;
}

export default function AttendanceDropdown({
  eventId,
  participantId,
  value,
}: AttendanceDropdownProps) {
  const options: EventParticipantStatus[] = ["ATTENDED", "ABSENT"];
  const [selectedConfig, setSelectedConfig] =
    useState<EventParticipantStatus | null>(
      value === "APPROVED" ? null : value || null,
    );

  const handleChange = async (val: EventParticipantStatus) => {
    try {
      await eventClubApiRequest.updateStatusParticipant(
        participantId,
        eventId,
        {
          status: val,
        },
      );
      setSelectedConfig(val);
    } catch (err) {
      console.error(err);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const isFinal = selectedConfig === "ATTENDED" || selectedConfig === "ABSENT";

  return (
    <Select
      value={selectedConfig || ""}
      onValueChange={(val) => handleChange(val as EventParticipantStatus)}
    >
      {/* Trigger */}
      <SelectTrigger
        className={`
          w-42 border rounded-md transition-all duration-200
          ${
            selectedConfig
              ? `${statusConfig[selectedConfig].color} ${statusConfig[selectedConfig].bgColor} ${statusConfig[selectedConfig].darkBgColor} font-medium`
              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          }
          ${isFinal ? "pointer-events-none" : ""}
        `}
      >
        <SelectValue placeholder="Xác nhận tham gia" />
      </SelectTrigger>

      {/* Content */}
      <SelectContent className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md dark:shadow-lg">
        {options.map((status) => {
          const config = statusConfig[status];
          return (
            <SelectItem
              key={status}
              value={status}
              className={`
                ${config.color} ${config.bgColor} ${
                  config.darkBgColor
                } font-medium cursor-pointer
                data-[highlighted]:${
                  status === "ATTENDED"
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-red-100 dark:bg-red-900"
                }
                rounded-md transition-colors duration-200
              `}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status === "ATTENDED"
                      ? "bg-green-500 dark:bg-green-400"
                      : "bg-red-500 dark:bg-red-400"
                  }`}
                />
                {config.label}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
