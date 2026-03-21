"use client";

import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { TournamentCreateRequest, ClubCategoryRequestType } from "@/schemaValidations/tournament.schema";

interface TeamMatchFormat {
  singles: number;
  menDoubles: number;
  womenDoubles: number;
  mixedDoubles: number;
}

interface ClubCategoriesSectionProps {
  control: Control<TournamentCreateRequest>;
  register: UseFormRegister<TournamentCreateRequest>;
  setValue: UseFormSetValue<TournamentCreateRequest>;
  watch: UseFormWatch<TournamentCreateRequest>;
  errors: FieldErrors<TournamentCreateRequest>;
  teamMatchFormats: Record<number, TeamMatchFormat>;
  setTeamMatchFormats: React.Dispatch<React.SetStateAction<Record<number, TeamMatchFormat>>>;
  clubFields: { id: string }[];
  appendClubCategory: () => void;
  removeClubCategory: (index: number) => void;
}

const defaultMatchFormat = (): TeamMatchFormat => ({
  singles: 0,
  menDoubles: 0,
  womenDoubles: 0,
  mixedDoubles: 0,
});

export default function ClubCategoriesSection({
  control,
  register,
  setValue,
  watch,
  errors,
  teamMatchFormats,
  setTeamMatchFormats,
  clubFields,
  appendClubCategory,
  removeClubCategory,
}: ClubCategoriesSectionProps) {
  const getMatchFormat = (index: number): TeamMatchFormat =>
    teamMatchFormats[index] ?? defaultMatchFormat();

  // Helper to get club category errors
  const getClubCategoryError = (index: number, field: keyof ClubCategoryRequestType) => {
    const clubErrors = errors.clubCategories as FieldErrors<ClubCategoryRequestType>[] | undefined;
    return clubErrors?.[index]?.[field];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Hạng mục CLB</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            appendClubCategory();
            // Reset match format for new category
            const newIndex = clubFields.length;
            setTeamMatchFormats((prev) => ({
              ...prev,
              [newIndex]: defaultMatchFormat(),
            }));
          }}
        >
          <Plus size={16} className="mr-1" /> Thêm hạng mục CLB
        </Button>
      </div>

      {clubFields.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p>Chưa có hạng mục CLB nào. Nhấn "Thêm hạng mục CLB" để bắt đầu.</p>
        </div>
      ) : (
        clubFields.map((field, index) => {
          const clubError = getClubCategoryError(index, "name");
          const feeError = getClubCategoryError(index, "clubRegistrationFee");
          const minRosterError = getClubCategoryError(index, "minClubRosterSize");
          const maxRosterError = getClubCategoryError(index, "maxClubRosterSize");
          const maxClubsError = getClubCategoryError(index, "maxClubs");

          return (
            <Card
              key={field.id}
              className="border-2 border-violet-200 dark:border-violet-700 p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                  Hạng mục CLB {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    removeClubCategory(index);
                    // Clean up match format
                    setTeamMatchFormats((prev) => {
                      const updated = { ...prev };
                      delete updated[index];
                      return updated;
                    });
                  }}
                >
                  <Trash size={16} className="mr-1" /> Xóa
                </Button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên hạng mục <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="VD: Giải CLB Nam"
                  {...register(`clubCategories.${index}.name` as const, {
                    required: "Tên hạng mục là bắt buộc",
                  })}
                />
                {clubError && <p className="text-red-500 text-sm mt-1">{clubError.message as string}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Mô tả</label>
                <Input
                  placeholder="Mô tả hạng mục..."
                  {...register(`clubCategories.${index}.description` as const)}
                />
              </div>

              {/* Fee & Roster */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phí đăng ký CLB (VNĐ)
                  </label>
                  <Input
                    type="number"
                    placeholder="500000"
                    {...register(`clubCategories.${index}.clubRegistrationFee` as const, {
                      valueAsNumber: true,
                    })}
                  />
                  {feeError && <p className="text-red-500 text-sm mt-1">{feeError.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số TV tối thiểu
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="5"
                    {...register(`clubCategories.${index}.minClubRosterSize` as const, {
                      valueAsNumber: true,
                    })}
                  />
                  {minRosterError && <p className="text-red-500 text-sm mt-1">{minRosterError.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số TV tối đa
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="10"
                    {...register(`clubCategories.${index}.maxClubRosterSize` as const, {
                      valueAsNumber: true,
                    })}
                  />
                  {maxRosterError && <p className="text-red-500 text-sm mt-1">{maxRosterError.message as string}</p>}
                </div>
              </div>

              {/* Team Match Format */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Format thi đấu <span className="text-gray-400 font-normal">(số ván mỗi loại)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {([
                    { key: "singles", label: "Ván đơn" },
                    { key: "menDoubles", label: "Đôi nam" },
                    { key: "womenDoubles", label: "Đôi nữ" },
                    { key: "mixedDoubles", label: "Đôi hỗn hợp" },
                  ] as const).map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                        {label}
                      </label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={getMatchFormat(index)[key]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setTeamMatchFormats((prev) => ({
                            ...prev,
                            [index]: {
                              ...getMatchFormat(index),
                              [key]: val,
                            },
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
                {/* Preview */}
                {(() => {
                  const fmt = getMatchFormat(index);
                  const total = (fmt.singles ?? 0) + (fmt.menDoubles ?? 0) + (fmt.womenDoubles ?? 0) + (fmt.mixedDoubles ?? 0);
                  const parts: string[] = [];
                  if (fmt.singles) parts.push(`${fmt.singles} đơn`);
                  if (fmt.menDoubles) parts.push(`${fmt.menDoubles} đôi nam`);
                  if (fmt.womenDoubles) parts.push(`${fmt.womenDoubles} đôi nữ`);
                  if (fmt.mixedDoubles) parts.push(`${fmt.mixedDoubles} hỗn hợp`);
                  return total > 0 ? (
                    <p className="text-xs text-violet-600 dark:text-violet-400 mt-2">
                      Preview: {parts.join(" + ")} (tổng {total} ván)
                    </p>
                  ) : null;
                })()}
              </div>

              {/* Max Clubs & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số CLB tối đa
                  </label>
                  <Input
                    type="number"
                    min={2}
                    placeholder="16"
                    {...register(`clubCategories.${index}.maxClubs` as const, {
                      valueAsNumber: true,
                    })}
                  />
                  {maxClubsError && <p className="text-red-500 text-sm mt-1">{maxClubsError.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hạn đăng ký
                  </label>
                  <Input
                    type="datetime-local"
                    {...register(`clubCategories.${index}.registrationDeadline` as const)}
                  />
                </div>
              </div>

              {/* Prizes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Giải nhất</label>
                  <Input
                    placeholder="VD: Cúp vàng + 10.000.000 VNĐ"
                    {...register(`clubCategories.${index}.firstPrize` as const)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Giải nhì</label>
                  <Input
                    placeholder="VD: Cúp bạc + 5.000.000 VNĐ"
                    {...register(`clubCategories.${index}.secondPrize` as const)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Giải ba</label>
                  <Input
                    placeholder="VD: Cúp đồng + 3.000.000 VNĐ"
                    {...register(`clubCategories.${index}.thirdPrize` as const)}
                  />
                </div>
              </div>

              {/* Rules */}
              <div>
                <label className="block text-sm font-medium mb-2">Thể lệ thi đấu</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[100px]"
                  placeholder="Nhập thể lệ thi đấu..."
                  {...register(`clubCategories.${index}.rules` as const)}
                />
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
