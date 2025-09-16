import { auth } from "~/server/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const pathAndQuery = req.nextUrl.pathname + req.nextUrl.search;
    const newUrl = new URL(
      `/login?redirectUrl=${encodeURIComponent(pathAndQuery)}`,
      req.nextUrl.origin,
    );
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/patients/:path*",
    "/prescriptions/:path*",
    "/settings/:path*",
  ],
};
