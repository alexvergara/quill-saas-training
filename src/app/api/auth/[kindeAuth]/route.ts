import { NextRequest } from "next/server";
import { AuthEndpoints, handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { kindeAuth: AuthEndpoints } }
) {
  const endpoint = params.kindeAuth;
  return handleAuth(request, endpoint);
}
