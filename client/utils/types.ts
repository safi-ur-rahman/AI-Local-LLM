import z from "zod";
import { ConversationSchema, MessageSchema } from "./schemas";

export type Message = z.infer<typeof MessageSchema>
export type Conversation = z.infer<typeof ConversationSchema>