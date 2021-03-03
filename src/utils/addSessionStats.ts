import { SessionStats } from "../models";

export default function addSessionStats(
  stats: SessionStats[],
  sessionStats: SessionStats
) {
  return [...stats, sessionStats].sort((a, b) =>
    a.points === b.points ? a.time - b.time : b.points - a.points
  );
}
