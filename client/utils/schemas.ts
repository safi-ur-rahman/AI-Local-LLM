import z from "zod";
import { MessageUsersTypes } from "./enums";

export const MessageSchema = z.object({
    role: z.enum(MessageUsersTypes),
    content: z.string().min(1, 'Content can not be empty.')
})

export const ConversationSchema = z.object({
    messages: z.array(MessageSchema)
})