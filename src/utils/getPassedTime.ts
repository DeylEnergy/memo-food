function padStart(value: number) {
  return String(value).padStart(2, "0");
}

export default function getPassedTime(totalSeconds: number) {
  const minutes = padStart(Math.floor(totalSeconds / 60));
  const seconds = padStart(Math.floor(totalSeconds % 60));

  return { minutes, seconds };
}
