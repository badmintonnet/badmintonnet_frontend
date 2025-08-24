import z from "zod";

export const MessageRes = z
  .object({
    message: z.string(),
  })
  .strict();

export type MessageResType = z.TypeOf<typeof MessageRes>;

export const FileRes = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    fileNames: z.array(z.string()),
  }),
});

export type FileResType = z.TypeOf<typeof FileRes>;
