import matched from "./matched.mp3";
import won from "./won.mp3";
import lost from "./lost.mp3";

const soundsRef = {
  matched,
  won,
  lost,
};

export default function getSound(soundName: "matched" | "won" | "lost") {
  return new Audio(soundsRef[soundName]);
}
