"use client";

import { useEffect, useState } from "react";

import type { RecommendedFacility } from "@/entities/home/model/types";
import {
  ContentRail,
  type RailCard,
  RailSkeleton
} from "@/features/home/ui/ContentRail";

export function RecommendedFacilitiesSection() {
  const [items, setItems] = useState<RecommendedFacility[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch("/api/home/recommended", {
          cache: "no-store",
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Failed to load recommended facilities");
        }

        const data = (await response.json()) as RecommendedFacility[];
        setItems(data);
      } catch {
        setItems([]);
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, []);

  if (!items) {
    return <RailSkeleton title="요양이 추천시설" href="/recommended" />;
  }

  const cards: RailCard[] = items.map((item) => ({
    id: item.id,
    href: item.href,
    title: item.name,
    subtitle: item.location,
    imageUrl: item.imageUrl,
    badge: item.badge,
    rating: item.rating,
    consultationLabel: item.consultationLabel
  }));

  return (
    <ContentRail
      title="요양이 추천시설"
      href="/recommended"
      items={cards}
      variant="recommended"
    />
  );
}

