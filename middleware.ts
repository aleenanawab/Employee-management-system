import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/employees/:path*",
    "/departments/:path*",
    "/salary/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};
