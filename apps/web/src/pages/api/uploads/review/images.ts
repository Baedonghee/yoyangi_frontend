import type { NextApiRequest, NextApiResponse } from "next";

import { siteConfig } from "@/shared/config/site";
import { parseServerApiJson } from "@/shared/api/server-api-proxy";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ status: 405, message: "Method Not Allowed" });
    return;
  }

  const token = req.cookies.token;
  const contentType = req.headers["content-type"];

  if (!token) {
    res.status(401).json({ status: 401, message: "로그인이 필요합니다." });
    return;
  }

  if (!contentType) {
    res
      .status(400)
      .json({ status: 400, message: "업로드 형식이 올바르지 않습니다." });
    return;
  }

  try {
    const response = await fetch(
      new URL("/api/v1/uploads/review/images", siteConfig.serverApiBaseUrl),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": contentType,
        },
        body: req as unknown as BodyInit,
        duplex: "half",
      } as RequestInit & { duplex: "half" },
    );
    const data = await parseServerApiJson(response);

    res.status(response.ok ? 200 : response.status).json(data);
  } catch {
    res.status(502).json({
      status: 502,
      message: "이미지 업로드 중 서버와 연결할 수 없습니다.",
    });
  }
}
