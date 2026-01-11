import { handlers } from "@/auth";

// We export GET and POST so NextAuth can handle the login redirects
export const { GET, POST } = handlers;