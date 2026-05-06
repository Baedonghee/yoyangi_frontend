import type { CarePageListing } from "./types";

export type ListingLikeState = {
  isLiked: boolean;
  likeCount: number;
  isUpdating: boolean;
};

export type ListingLikeStateMap = Record<string, ListingLikeState>;

export function makeListingLikeState(
  listings: CarePageListing[],
): ListingLikeStateMap {
  return listings.reduce<ListingLikeStateMap>((state, listing) => {
    state[listing.id] = {
      isLiked: listing.isLiked,
      likeCount: listing.likeCount,
      isUpdating: false,
    };

    return state;
  }, {});
}

export function getListingLikeState(
  likeState: ListingLikeStateMap,
  listing: CarePageListing,
): ListingLikeState {
  return (
    likeState[listing.id] ?? {
      isLiked: listing.isLiked,
      likeCount: listing.likeCount,
      isUpdating: false,
    }
  );
}

export function getNextLikeCount(count: number, nextLiked: boolean) {
  return Math.max(0, count + (nextLiked ? 1 : -1));
}
