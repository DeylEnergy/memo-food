export default function shuffleArray(arr: unknown[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}
