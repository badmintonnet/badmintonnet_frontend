import http from "@/lib/http";

import { FileResType } from "@/schemaValidations/common.schema";
import {
  CreateEventBodyType,
  EventDetailResponseType,
} from "@/schemaValidations/event.schema";
const eventApiRequest = {
  uploadImage: (body: FormData) =>
    http.post<FileResType>("/event/upload", body),

  createEvent: (body: CreateEventBodyType) => http.post("/event", body),
};
export default eventApiRequest;
