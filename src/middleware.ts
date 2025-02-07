import { NextResponse, type NextRequest } from "next/server";
import axios from "axios";
import { Session } from "./lib/better-auth/auth-types";

async function getMiddlewareSession(req: NextRequest) {
  const { data: session } = await axios.get<Session>("/api/auth/get-session", {
    baseURL: req.nextUrl.origin,
    headers: {
      //get the cookie from the request
      cookie: req.headers.get("cookie") || "",
    },
  });

  return session;
}

export default async function authMiddleware(req: NextRequest) {
  const session = await getMiddlewareSession(req);
  const pathname = req.nextUrl.pathname
  const url = req.url

  if(pathname === "/"){
    return NextResponse.redirect(new URL("/dashboard", url))
  }

  if(pathname.startsWith("/dashboard")){
    if(session){
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/sign-in", url))
  }

  if(pathname.startsWith("/sign-")){
    if(!session){
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/dashboard", url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};