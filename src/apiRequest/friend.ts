import http from "@/lib/http";
import {
  AddFriendBodyType,
  FriendListResponseType,
  FriendResponseType,
} from "@/schemaValidations/friend.schema";

const friendApiRequest = {
  getRelationships: (accountId: string, token: string) => {
    return http.get<FriendResponseType>(`/friends/relationship/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getFriendList: (accountId: string, token: string) => {
    return http.get<FriendListResponseType>(`/friends/list/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  sendFriendRequest: (data: AddFriendBodyType, token: string) => {
    return http.post<FriendResponseType>(`/friends/request`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  acceptFriendRequest: (requesterId: string, token: string) => {
    return http.post<FriendResponseType>(`/friends/${requesterId}/accept`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  rejectFriendRequest: (requesterId: string, token: string) => {
    return http.post<FriendResponseType>(`/friends/${requesterId}/reject`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  unfriend: (friendId: string) => {
    return http.delete(`/friends/unfriend/${friendId}`);
  },
};

export default friendApiRequest;
