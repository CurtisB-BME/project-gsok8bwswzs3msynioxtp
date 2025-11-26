import { superdevClient } from "@/lib/superdev/client";

export const SapienceTest = superdevClient.entity("SapienceTest");
export const SupportTicket = superdevClient.entity("SupportTicket");
export const TestLog = superdevClient.entity("TestLog");
export const User = superdevClient.auth;
