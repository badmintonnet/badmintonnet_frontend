"use client";

import addressApiRequest from "@/apiRequest/address";
import clubServiceApi from "@/apiRequest/club";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  ProvinceType,
  WardType,
} from "@/schemaValidations/address.schema";
import type { ClubPageResType } from "@/schemaValidations/clubs.schema";
import { Building2, Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type RankingScope = "GLOBAL" | "AREA" | "CLUB";
type ClubSuggestion = ClubPageResType["data"]["content"][number];

export default function RankingScopeFilter({
  scope,
  province,
  ward,
  area,
  club,
}: {
  scope: RankingScope;
  province: string;
  ward: string;
  area: string;
  club: string;
}) {
  const router = useRouter();
  const [provinces, setProvinces] = useState<ProvinceType[]>([]);
  const [wards, setWards] = useState<WardType[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [clubValue, setClubValue] = useState(club);
  const [selectedClubSlug, setSelectedClubSlug] = useState(club);
  const [clubSuggestions, setClubSuggestions] = useState<ClubSuggestion[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [showClubSuggestions, setShowClubSuggestions] = useState(false);

  const selectedProvince = useMemo(
    () => provinces.find((item) => item.id === selectedProvinceId),
    [provinces, selectedProvinceId],
  );
  const selectedWard = useMemo(
    () => wards.find((item) => item.id === selectedWardId),
    [wards, selectedWardId],
  );

  useEffect(() => {
    if (scope !== "AREA") return;

    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await addressApiRequest.getProvinces();
        setProvinces(response.payload.data.data || []);
      } catch (error) {
        console.error("Error loading ranking provinces:", error);
        setProvinces([]);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, [scope]);

  useEffect(() => {
    if (scope !== "AREA" || provinces.length === 0 || selectedProvinceId) {
      return;
    }

    const initialProvince = province || area;
    if (!initialProvince) return;

    const matchedProvince = provinces.find(
      (item) =>
        item.full_name === initialProvince ||
        item.name === initialProvince ||
        initialProvince.includes(item.name),
    );

    if (matchedProvince) {
      setSelectedProvinceId(matchedProvince.id);
    }
  }, [area, province, provinces, scope, selectedProvinceId]);

  useEffect(() => {
    if (scope !== "AREA" || !selectedProvinceId) {
      setWards([]);
      setSelectedWardId("");
      return;
    }

    const fetchWards = async () => {
      setLoadingWards(true);
      try {
        const response =
          await addressApiRequest.getWardsByProvinceId(selectedProvinceId);
        setWards(response.payload.data.data || []);
      } catch (error) {
        console.error("Error loading ranking wards:", error);
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [scope, selectedProvinceId]);

  useEffect(() => {
    if (scope !== "AREA" || wards.length === 0 || selectedWardId || !ward) {
      return;
    }

    const matchedWard = wards.find(
      (item) =>
        item.full_name === ward ||
        item.name === ward ||
        ward.includes(item.name),
    );

    if (matchedWard) {
      setSelectedWardId(matchedWard.id);
    }
  }, [scope, selectedWardId, ward, wards]);

  useEffect(() => {
    if (scope !== "CLUB") {
      setClubSuggestions([]);
      setLoadingClubs(false);
      setShowClubSuggestions(false);
      return;
    }

    const keyword = clubValue.trim();
    if (keyword.length < 2) {
      setClubSuggestions([]);
      setLoadingClubs(false);
      return;
    }

    let isCancelled = false;
    setLoadingClubs(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await clubServiceApi.getAllPublicClubs({
          page: 0,
          size: 6,
          search: keyword,
          includeJoined: true,
        });

        if (!isCancelled) {
          setClubSuggestions(response.payload.data.content || []);
        }
      } catch (error) {
        console.error("Error loading ranking clubs:", error);
        if (!isCancelled) {
          setClubSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setLoadingClubs(false);
        }
      }
    }, 300);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [clubValue, scope]);

  if (scope === "GLOBAL") {
    return null;
  }

  const applyAreaFilter = () => {
    const params = new URLSearchParams();
    params.set("scope", "AREA");

    if (selectedProvince) params.set("province", selectedProvince.full_name);
    if (selectedWard) params.set("ward", selectedWard.full_name);

    router.push(`/rankings?${params.toString()}`);
  };

  const applyClubFilter = () => {
    const params = new URLSearchParams();
    params.set("scope", "CLUB");

    const keyword = clubValue.trim();
    const exactMatch = clubSuggestions.find(
      (item) => item.name.toLowerCase() === keyword.toLowerCase(),
    );
    const selectedClub = selectedClubSlug || exactMatch?.slug || keyword;

    if (selectedClub) params.set("club", selectedClub);

    router.push(`/rankings?${params.toString()}`);
  };

  const clearFilter = () => {
    router.push(`/rankings?scope=${scope}`);
    setSelectedProvinceId("");
    setSelectedWardId("");
    setClubValue("");
    setSelectedClubSlug("");
    setClubSuggestions([]);
    setShowClubSuggestions(false);
  };

  if (scope === "CLUB") {
    return (
      <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative">
          <Input
            value={clubValue}
            onBlur={() => {
              window.setTimeout(() => setShowClubSuggestions(false), 150);
            }}
            onChange={(event) => {
              setClubValue(event.target.value);
              setSelectedClubSlug("");
              setShowClubSuggestions(true);
            }}
            onFocus={() => {
              if (clubValue.trim().length >= 2) {
                setShowClubSuggestions(true);
              }
            }}
            placeholder="Gõ tên CLB để tìm"
            className="h-11 rounded-md"
          />

          {showClubSuggestions &&
            (loadingClubs ||
              clubSuggestions.length > 0 ||
              clubValue.trim().length >= 2) && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-xl shadow-emerald-950/10 dark:border-gray-800 dark:bg-gray-950">
                {loadingClubs && (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                    Đang tìm CLB...
                  </div>
                )}

                {!loadingClubs && clubSuggestions.length > 0 && (
                  <div className="max-h-72 overflow-y-auto p-1">
                    {clubSuggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setClubValue(item.name);
                          setSelectedClubSlug(item.slug);
                          setShowClubSuggestions(false);
                        }}
                        className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                          {item.logoUrl ? (
                            <Image
                              src={item.logoUrl}
                              alt={`${item.name} logo`}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-4 w-4" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {item.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
                            {[
                              item.facility?.name,
                              item.location || item.facility?.address,
                            ]
                              .filter(Boolean)
                              .join(" - ") || "Chưa cập nhật địa chỉ"}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {!loadingClubs && clubSuggestions.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Không tìm thấy CLB phù hợp.
                  </div>
                )}
              </div>
            )}
        </div>

        <Button
          type="button"
          onClick={applyClubFilter}
          className="h-11 rounded-md sm:w-36"
        >
          <Search className="mr-2 h-4 w-4" />
          Lọc
        </Button>
        {clubValue && (
          <Button
            type="button"
            variant="outline"
            onClick={clearFilter}
            className="h-11 rounded-md sm:w-28"
          >
            <X className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 md:grid-cols-[1fr_1fr_auto_auto]">
      <select
        value={selectedProvinceId}
        onChange={(event) => {
          setSelectedProvinceId(event.target.value);
          setSelectedWardId("");
        }}
        disabled={loadingProvinces}
        className="h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-emerald-950"
      >
        <option value="">Tỉnh/Thành phố</option>
        {provinces.map((item) => (
          <option key={item.id} value={item.id}>
            {item.full_name}
          </option>
        ))}
      </select>

      <select
        value={selectedWardId}
        onChange={(event) => setSelectedWardId(event.target.value)}
        disabled={!selectedProvinceId || loadingWards}
        className="h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-emerald-950"
      >
        <option value="">Phường/Xã hoặc Quận/Huyện</option>
        {wards.map((item) => (
          <option key={item.id} value={item.id}>
            {item.full_name}
          </option>
        ))}
      </select>

      <Button
        type="button"
        onClick={applyAreaFilter}
        className="h-11 rounded-md md:w-32"
      >
        <Search className="mr-2 h-4 w-4" />
        Lọc
      </Button>

      {(selectedProvinceId || selectedWardId) && (
        <Button
          type="button"
          variant="outline"
          onClick={clearFilter}
          className="h-11 rounded-md md:w-28"
        >
          <X className="mr-2 h-4 w-4" />
          Xóa
        </Button>
      )}
    </div>
  );
}
