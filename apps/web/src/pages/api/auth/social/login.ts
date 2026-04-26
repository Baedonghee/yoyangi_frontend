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

  const response = await requestServerApi("/api/v1/auth/social/login", {
    method: "POST",
    body: JSON.stringify(req.body)
  });
  const data = await parseServerApiJson(response);

  res.status(response.ok ? 200 : response.status).json(data);
}
