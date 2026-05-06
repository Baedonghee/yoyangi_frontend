import type { ParsedUrlQuery } from "querystring";

import type { CareViewMode } from "@/entities/cares/model/types";

export type CaresViewMode = CareViewMode;

export type CaresQueryState = {
  themeCodes: string[];
  regionIds: string[];
  viewMode: CaresViewMode;
  page: number;
};

const CARES_STATE_QUERY_KEYS = new Set(["themes", "regionIds", "view", "page"]);

function toSingleQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.join(",");
  }

  return value;
}

function parseCommaQueryValue(value: string | string[] | undefined) {
  const queryValue = toSingleQueryValue(value);

  return queryValue
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function toViewMode(value: string | string[] | undefined): CaresViewMode {
  const queryValue = toSingleQueryValue(value);

  return queryValue === "list" ? "list" : "grid";
}

export function toPositivePage(value: string | string[] | undefined) {
  const queryValue = toSingleQueryValue(value);
  const parsedPage = Number.parseInt(queryValue ?? "", 10);

  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

export function getCaresQueryState(query: ParsedUrlQuery): CaresQueryState {
  return {
    themeCodes: uniqueStrings(parseCommaQueryValue(query.themes)),
    regionIds: uniqueStrings(parseCommaQueryValue(query.regionIds)),
    viewMode: toViewMode(query.view),
    page: toPositivePage(query.page),
  };
}

export function buildCaresQuery(
  state: CaresQueryState,
  baseQuery: ParsedUrlQuery = {},
): ParsedUrlQuery {
  const query: ParsedUrlQuery = {};
  const themeCodes = uniqueStrings(state.themeCodes);
  const regionIds = uniqueStrings(state.regionIds);

  Object.entries(baseQuery).forEach(([key, value]) => {
    if (!CARES_STATE_QUERY_KEYS.has(key) && value) {
      query[key] = value;
    }
  });

  if (themeCodes.length) {
    query.themes = themeCodes.join(",");
  }

  if (regionIds.length) {
    query.regionIds = regionIds.join(",");
  }

  if (state.viewMode === "list") {
    query.view = state.viewMode;
  }

  if (state.page > 1) {
    query.page = String(state.page);
  }

  return query;
}
