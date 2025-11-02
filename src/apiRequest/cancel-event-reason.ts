import http from "@/lib/http";
import { ClubEventCancellationListResType } from "@/schemaValidations/event-cancellation.schema";

const cancelReasonRequest = {
  getEventCancellations: (eventId: string, accessToken: string) =>
    http.get<ClubEventCancellationListResType>(
      `/event-cancellations/event/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),

  reviewCancellation: (
    cancellationId: string,
    approve: boolean,
    accessToken: string
  ) =>
    http.post(
      `/event-cancellations/${cancellationId}/review?approve=${encodeURIComponent(
        String(approve)
      )}`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
};
export default cancelReasonRequest;
