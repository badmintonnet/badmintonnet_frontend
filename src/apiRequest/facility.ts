import http from "@/lib/http";

import { FileResType } from "@/schemaValidations/common.schema";
import {
  CreateFacilityBodyType,
  FacilitiesResponseType,
  FacilityType,
  PagedFacilityResponseType,
} from "@/schemaValidations/event.schema";

const facilityApiRequest = {
  uploadImage: (body: FormData) =>
    http.post<FileResType>("/facilities/upload", body),

  getAllFacilities: (page: number, size: number, token = "") =>
    http.get<PagedFacilityResponseType>(
      `/facilities?page=${page}&size=${size}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),

  getAllFacilitiesFilter: () =>
    http.get<FacilitiesResponseType>(`/facilities/all/filter`),

  createFacility: (body: CreateFacilityBodyType) =>
    http.post<FacilityType>("/facilities", body),

  deleteFacility: (id: string, token = "") =>
    http.delete(`/facilities/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  // updateFacility: (id: string, body: Partial<CreateFacilityBodyType>) =>
  //   http.put<FacilityType>(`/facilities/${id}`, body),
};
export default facilityApiRequest;
