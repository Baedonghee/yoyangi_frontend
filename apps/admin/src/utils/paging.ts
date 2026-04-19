// Function to calculate the sequence based on the current page and total items
export const calculateSequence = (page: number, size: number, total: number): number[] => {
  const start = total - (page - 1) * size;
  const end = Math.max(start - size + 1, 1);
  return Array.from({ length: start - end + 1 }, (_, index) => end + index);
};
