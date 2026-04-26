import type { NextApiRequest, NextApiResponse } from "next";

import type { ApiResponse, UserPayload } from "@/entities/auth/model/types";
import {
  parseServerApiJson,
  requestServerApi
} from "@/shared/api/server-api-proxy";

const TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ status: 405, message: "Method Not Allowed" });
    return;
  }

  const token = req.cookies.token;
  const authorization = req.headers.authorization ?? (token ? `Bearer ${token}` : undefined);

  if (!authorization) {
    res.status(401).json({ status: 401, message: "로그인 정보가 없습니다." });
    return;
  }

  const response = await requestServerApi("/api/v1/me", {
    method: "GET",
    headers: {
      Authorization: authorization
    }
  });
  const data = (await parseServerApiJson(response)) as ApiResponse<UserPayload>;

  if (data.status === 200 && data.data?.authorization?.accessToken) {
    res.setHeader(
      "Set-Cookie",
      serializeCookie("token", data.data.authorization.accessToken)
    );
  }

  res.status(response.ok ? 200 : response.status).json(data);
}

function serializeCookie(name: string, value: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  return `${name}=${encodeURIComponent(value)}; Max-Age=${TOKEN_MAX_AGE}; Path=/; HttpOnly; SameSite=Strict${secure}`;
}
