import http from "@/lib/http";
import {
  CreateHighlightType,
  HighlightType,
  UpdateHighlightType,
} from "@/schemaValidations/highlight.schema";

const highlightApiRequest = {
  getHighlightsByEventId: async (eventId: string, token: string) => {
    return await http.get<HighlightType[]>(
      `/api/events/${eventId}/highlights`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  createHighlight: async (data: CreateHighlightType, token: string) => {
    return await http.post<HighlightType>("/api/highlights", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateHighlight: async (data: UpdateHighlightType, token: string) => {
    return await http.put<HighlightType>(`/api/highlights/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteHighlight: async (id: string, token: string) => {
    return await http.delete(`/api/highlights/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  likeHighlight: async (id: string, token: string) => {
    return await http.post(
      `/api/highlights/${id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  unlikeHighlight: async (id: string, token: string) => {
    return await http.delete(`/api/highlights/${id}/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default highlightApiRequest;
