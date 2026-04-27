import http from "@/lib/http";
import {
  AskChatbotResponse,
  ChatMessage,
  ChatSession,
  SessionDetailResponse,
} from "@/components/chatbot/types";

interface AskBody {
  sessionId: string;
  question: string;
}

interface PaginationParams {
  page?: number;
  size?: number;
}

type PagedMessagesShape = {
  sessionId?: string;
  messages?: ChatMessage[];
  content?: ChatMessage[];
  page?: number;
  size?: number;
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
};

type ApiEnvelope<T> = {
  data?: T;
};

type UnknownRecord = Record<string, unknown>;

const unwrapPayload = <T>(payload: T | ApiEnvelope<T>): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
};

const normalizeSessions = (payload: unknown): ChatSession[] => {
  const unwrapped = unwrapPayload(payload as unknown);

  const rawList = Array.isArray(unwrapped)
    ? unwrapped
    : Array.isArray((unwrapped as UnknownRecord)?.content)
      ? ((unwrapped as UnknownRecord).content as unknown[])
      : [];

  const sessions = rawList
    .filter((item): item is UnknownRecord => !!item && typeof item === "object")
    .map((item) => {
      const sessionId =
        (typeof item.sessionId === "string" && item.sessionId) ||
        (typeof item.id === "string" && item.id) ||
        "";

      if (!sessionId) return null;

      const lastMessage =
        (typeof item.lastMessage === "string" && item.lastMessage) ||
        (typeof item.message === "string" && item.message) ||
        (typeof item.content === "string" && item.content) ||
        "Cuoc tro chuyen";

      const lastMessageTime =
        (typeof item.lastMessageTime === "string" && item.lastMessageTime) ||
        (typeof item.updatedAt === "string" && item.updatedAt) ||
        (typeof item.createdAt === "string" && item.createdAt) ||
        new Date().toISOString();

      const lastRole =
        item.lastRole === "assistant" || item.lastRole === "user"
          ? item.lastRole
          : item.role === "assistant" || item.role === "user"
            ? item.role
            : "assistant";

      const updatedAt =
        (typeof item.updatedAt === "string" && item.updatedAt) ||
        (typeof item.lastMessageTime === "string" && item.lastMessageTime) ||
        (typeof item.createdAt === "string" && item.createdAt) ||
        new Date().toISOString();

      return {
        sessionId,
        lastMessage,
        lastMessageTime,
        lastRole,
        updatedAt,
      } satisfies ChatSession;
    })
    .filter((item): item is ChatSession => item !== null);

  return sessions;
};

const normalizeSessionDetail = (payload: unknown): SessionDetailResponse => {
  const unwrapped = unwrapPayload(
    payload as PagedMessagesShape | ApiEnvelope<PagedMessagesShape>,
  );

  const rawMessages = Array.isArray(unwrapped?.messages)
    ? unwrapped.messages
    : Array.isArray(unwrapped?.content)
      ? unwrapped.content
      : [];

  const messages = rawMessages
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: item.id || `msg-${Date.now()}-${index}`,
      role: item.role,
      content: item.content || "",
      createdAt: item.createdAt || new Date().toISOString(),
    })) as ChatMessage[];

  const page = typeof unwrapped?.page === "number" ? unwrapped.page : 0;
  const size =
    typeof unwrapped?.size === "number" ? unwrapped.size : messages.length;
  const totalPages =
    typeof unwrapped?.totalPages === "number" ? unwrapped.totalPages : 1;
  const totalElements =
    typeof unwrapped?.totalElements === "number"
      ? unwrapped.totalElements
      : messages.length;
  const hasMore =
    typeof unwrapped?.last === "boolean"
      ? !unwrapped.last
      : page + 1 < totalPages;

  return {
    sessionId: unwrapped?.sessionId || "",
    messages,
    page,
    size,
    totalPages,
    totalElements,
    hasMore,
  };
};

const normalizeAskResponse = (payload: unknown): AskChatbotResponse => {
  const unwrapped = unwrapPayload(
    payload as AskChatbotResponse | ApiEnvelope<AskChatbotResponse>,
  );

  return {
    answer: unwrapped?.answer || "",
    sessionId: unwrapped?.sessionId || "",
  };
};

const chatbotSessionApi = {
  ask: async (body: AskBody) => {
    const response = await http.post<
      AskChatbotResponse | ApiEnvelope<AskChatbotResponse>
    >("/chatbot/ask", body);

    return {
      ...response,
      payload: normalizeAskResponse(response.payload),
    };
  },

  getSessions: async () => {
    const response = await http.get<ChatSession[] | ApiEnvelope<ChatSession[]>>(
      "/chatbot/sessions",
    );

    return {
      ...response,
      payload: normalizeSessions(response.payload),
    };
  },

  getSessionDetail: async (sessionId: string, params?: PaginationParams) => {
    const page = params?.page ?? 0;
    const size = params?.size ?? 20;
    const response = await http.get<
      SessionDetailResponse | ApiEnvelope<SessionDetailResponse>
    >(`/chatbot/sessions/${sessionId}?page=${page}&size=${size}`);

    return {
      ...response,
      payload: normalizeSessionDetail(response.payload),
    };
  },
};

export default chatbotSessionApi;
