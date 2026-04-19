import { getRecommendedFacilities } from "@/entities/home/api/get-home-page-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getRecommendedFacilities();

  return Response.json(data);
}

