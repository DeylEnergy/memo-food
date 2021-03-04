import React from "react";
import apple from "./apple.svg";
import candy from "./candy.svg";
import cheese from "./cheese.svg";
import cupcake from "./cupcake.svg";
import doughnut from "./doughnut.svg";
import egg from "./egg.svg";
import fries from "./fries.svg";
import gingerbread from "./gingerbread.svg";
import hamburger from "./hamburger.svg";
import honey from "./honey.svg";
import hotdog from "./hotdog.svg";
import icecream from "./icecream.svg";
import milk from "./milk.svg";
import orange from "./orange.svg";
import peach from "./peach.svg";
import pizza from "./pizza.svg";
import pudding from "./pudding.svg";
import watermelon from "./watermelon.svg";

const iconsRef: { [key: string]: string } = {
  apple,
  candy,
  cheese,
  cupcake,
  doughnut,
  egg,
  fries,
  gingerbread,
  hamburger,
  honey,
  hotdog,
  icecream,
  milk,
  orange,
  peach,
  pizza,
  pudding,
  watermelon,
};

export default function getIcon({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return React.createElement("img", {
    src: iconsRef[label],
    alt: label,
    className,
  });
}
