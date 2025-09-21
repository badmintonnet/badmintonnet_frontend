import http from "@/lib/http";
import {
  CreateHighlightType,
  FileResType,
  HighlightResponseType,
  UpdateHighlightType,
  // UpdateHighlightType,
} from "@/schemaValidations/highlight.schema";

const highlightApiRequest = {
  uploadFileHightLight: (body: FormData) =>
    http.post<FileResType>("/posts/upload", body),

  getHighlightsByEventId: async (eventId: string, token: string) => {
    return await http.get<HighlightResponseType>(`/posts/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createHighlight: async (data: CreateHighlightType, token: string) => {
    return await http.post<HighlightResponseType>("/posts", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateHighlight: async (data: UpdateHighlightType, token: string) => {
    return await http.put<HighlightResponseType>("/posts", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // deleteHighlight: async (id: string, token: string) => {
  //   return await http.delete(`/api/highlights/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // },

  // likeHighlight: async (id: string, token: string) => {
  //   return await http.post(
  //     `/api/highlights/${id}/like`,
  //     {},
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  // },

  // unlikeHighlight: async (id: string, token: string) => {
  //   return await http.delete(`/api/highlights/${id}/like`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // },
};

export default highlightApiRequest;
