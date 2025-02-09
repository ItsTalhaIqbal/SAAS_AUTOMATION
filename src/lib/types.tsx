import z from "zod";
export const EditUserProfileSchema = z.object({
  email: z.string().email("Reqired"),
  name: z.string().min(1, "Required"),
});
