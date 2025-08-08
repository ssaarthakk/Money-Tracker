import { NextResponse } from "next/server";

// Minimal pass-through middleware to keep Edge runtime bundle free of server-only deps
export function middleware() {
	return NextResponse.next();
}

// If you need to scope middleware, uncomment and customize the matcher below
// export const config = { matcher: ["/dashboard/:path*", "/api/protected/:path*"] }