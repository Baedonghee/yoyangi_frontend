import type { NextApiRequest, NextApiResponse } from "next";

import {
  parseServerApiJson,
  requestServerApi,
} from "@/shared/api/server-api-proxy";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    res.setHeader("Allow", "POST, DELETE");
    res.status(405).json({ status: 405, message: "Method Not Allowed" });
    return;
  }

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const token = req.cookies.token;

  if (!id) {
    res.status(400).json({ status: 400, message: "시설 ID가 없습니다." });
    return;
  }

  if (!token) {
    res.status(401).json({ status: 401, message: "로그인이 필요합니다." });
    return;
  }

  try {
    const response = await requestServerApi(
      `/api/v1/residences/${encodeURIComponent(id)}/like`,
      {
        method: req.method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await parseServerApiJson(response);

    res.status(response.ok ? 200 : response.status).json(data);
  } catch {
    res.status(502).json({
      status: 502,
      message: "찜 처리 중 서버와 연결할 수 없습니다.",
    });
  }
}
