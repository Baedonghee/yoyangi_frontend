import type { NextApiRequest, NextApiResponse } from "next";

import {
  parseServerApiJson,
  requestServerApi,
} from "@/shared/api/server-api-proxy";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ status: 405, message: "Method Not Allowed" });
    return;
  }

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!id) {
    res.status(400).json({ status: 400, message: "시설 ID가 없습니다." });
    return;
  }

  const token = req.cookies.token;
  const authorization = token ? `Bearer ${token}` : undefined;

  if (req.method === "POST" && !authorization) {
    res.status(401).json({ status: 401, message: "로그인이 필요합니다." });
    return;
  }

  try {
    const page = Array.isArray(req.query.page)
      ? req.query.page[0]
      : req.query.page;
    const path =
      req.method === "GET"
        ? `/api/v1/residences/${encodeURIComponent(id)}/reviews?page=${page || "1"}`
        : `/api/v1/residences/${encodeURIComponent(id)}/reviews`;
    const response = await requestServerApi(path, {
      method: req.method,
      headers: authorization ? { Authorization: authorization } : undefined,
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });
    const data = await parseServerApiJson(response);

    res.status(response.ok ? 200 : response.status).json(data);
  } catch {
    res.status(502).json({
      status: 502,
      message: "후기 정보를 불러올 수 없습니다.",
    });
  }
}
