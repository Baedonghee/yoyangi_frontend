import type { ComponentType } from "react";

import type { HomeIconName } from "@/entities/home/model/types";
import Care from "@/shared/ui/icons/theme/icons/care";
import Cooking from "@/shared/ui/icons/theme/icons/cooking";
import Downtown from "@/shared/ui/icons/theme/icons/downtown";
import Economy from "@/shared/ui/icons/theme/icons/economy";
import Manpower from "@/shared/ui/icons/theme/icons/manpower";
import Premium from "@/shared/ui/icons/theme/icons/premium";
import Program from "@/shared/ui/icons/theme/icons/program";
import Rehabilitation from "@/shared/ui/icons/theme/icons/rehabilitation";
import Religion from "@/shared/ui/icons/theme/icons/religion";
import Walk from "@/shared/ui/icons/theme/icons/walk";

type ThemeCategoryIconProps = {
  name: HomeIconName;
  className?: string;
};

type ThemeIconName = Extract<
  HomeIconName,
  "RE" | "PR" | "EC" | "NU" | "CK" | "RH" | "LA" | "PG" | "DT" | "WK"
>;

const themeIconMap = {
  RE: Religion,
  PR: Premium,
  EC: Economy,
  NU: Care,
  CK: Cooking,
  RH: Rehabilitation,
  LA: Manpower,
  PG: Program,
  DT: Downtown,
  WK: Walk
} satisfies Record<ThemeIconName, ComponentType<{ width?: string; height?: string; className?: string }>>;

export function ThemeCategoryIcon({ name, className }: ThemeCategoryIconProps) {
  if (!(name in themeIconMap)) {
    return null;
  }

  const Icon = themeIconMap[name as ThemeIconName];

  return <Icon width="18" height="18" className={className} aria-hidden="true" />;
}
