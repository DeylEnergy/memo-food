export default function splitRows(arr: unknown[], size: number) {
  const rowsHeight = Math.ceil(arr.length / size);

  const rows = Array(rowsHeight)
    .fill("")
    .map((_, index) => arr.slice(size * index, size * index + size));

  return rows;
}
