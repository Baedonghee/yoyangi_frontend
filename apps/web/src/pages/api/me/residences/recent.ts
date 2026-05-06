import type { NextApiRequest, NextApiResponse } from "next";

import {
  parseServerApiJson,
  requestServerApi,
} from "@/shared/api/server-api-proxy";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ status: 405, message: "Method Not Allowed" });
    return;
  }

  const authorization = getAuthorization(req);

  if (!authorization) {
    res.status(401).json({ status: 401, message: "로그인이 필요합니다." });
    return;
  }

  try {
    const response = await requestServerApi(
      `/api/v1/me/residences/recent?${buildQueryString(req.query)}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: authorization,
        },
      },
    );
    const data = await parseServerApiJson(response);

    res.status(response.ok ? 200 : response.status).json(data);
  } catch {
    res.status(502).json({
      status: 502,
      message: "최근 본 시설 정보를 불러오지 못했습니다.",
    });
  }
}

function getAuthorization(req: NextApiRequest) {
  const token = req.cookies.token;
  const authorization = req.headers.authorization;

  return authorization ?? (token ? `Bearer ${token}` : undefined);
}

function buildQueryString(query: NextApiRequest["query"]) {
  const params = new URLSearchParams();

  params.set("page", firstValue(query.page) ?? "1");
  params.set("size", firstValue(query.size) ?? "10");

  Object.entries(query).forEach(([key, value]) => {
    if (key === "page" || key === "size") {
      return;
    }

    const values = Array.isArray(value) ? value : [value];

    values.forEach((item) => {
      if (item) {
        params.append(key, item);
      }
    });
  });

  return params.toString();
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
