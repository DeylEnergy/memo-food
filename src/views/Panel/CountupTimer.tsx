import React from "react";
import { getPassedTime } from "../../utils";

function CountupTimer() {
  const [totalSeconds, setTotalSeconds] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds((sec) => sec + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { minutes, seconds } = getPassedTime(totalSeconds);

  return (
    <>
      {minutes}:{seconds}
    </>
  );
}

export default React.memo(CountupTimer);
