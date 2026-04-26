import type { NextApiRequest, NextApiResponse } from "next";

import {
  parseServerApiJson,
  requestServerApi
} from "@/shared/api/server-api-proxy";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ status: 405, message: "Method Not Allowed" });
    return;
  }

  const token = req.cookies.token;
  const authorization = req.headers.authorization ?? (token ? `Bearer ${token}` : undefined);

  if (authorization) {
    const response = await requestServerApi("/api/v1/auth/logout", {
      method: "POST",
      headers: {
        Authorization: authorization
      }
    });
    const data = await parseServerApiJson(response);

    res.setHeader("Set-Cookie", expireTokenCookie());
    res.status(response.ok ? 200 : response.status).json(data);
    return;
  }

  res.setHeader("Set-Cookie", expireTokenCookie());
  res.status(200).json({ status: 200 });
}

function expireTokenCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  return `token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict${secure}`;
}
