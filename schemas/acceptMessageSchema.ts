import { z } from "zod";

export const accceptMessageSchema = z.object({
    accceptMessages: z.boolean(),
});