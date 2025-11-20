import { superdevClient } from "@/lib/superdev/client";

export const SupportTicket = superdevClient.entity("SupportTicket");
export const TestLog = superdevClient.entity("TestLog");
export const User = superdevClient.auth;
