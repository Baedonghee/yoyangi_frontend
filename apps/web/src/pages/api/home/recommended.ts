import type { NextApiRequest, NextApiResponse } from "next";

import { getRecommendedFacilities } from "@/entities/home/api/get-home-page-data";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await getRecommendedFacilities();

  res.status(200).json(data);
}

