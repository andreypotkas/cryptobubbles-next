"use client";

import { PixiUtils } from "@/app/lib/pixi.utils";
import { Circle, PriceChangePercentage } from "@/types/bubbles.types";
import { CoingeckoCoinData } from "@/types/coingecko.type";
import * as PIXI from "pixi.js";
import React, { useEffect, useMemo, useState } from "react";
import { BubblesUtils, appConfig } from "../../lib/bubbles.utils";
import Loader from "../Loader/Loader";
import NavigationBar from "./NavigationBar";

type Props = {
  coins: CoingeckoCoinData[];
};

const { width, height, maxCircleSize, minCircleSize } = appConfig;

export default function Bubbles({ coins = [] }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [circles, setCircles] = useState<Circle[] | null>(null);
  const [bubbleSort, setBubbleSort] = useState(PriceChangePercentage.HOUR);

  const appRef = React.useRef<HTMLDivElement>(null);

  const scalingFactor = useMemo(() => {
    return BubblesUtils.getScalingFactor(coins, bubbleSort);
  }, [bubbleSort, coins]);

  useEffect(() => {
    if (coins) {
      const scalingFactor = BubblesUtils.getScalingFactor(coins, PriceChangePercentage.HOUR);
      const shapes = BubblesUtils.generateCircles(coins, scalingFactor);
      setCircles(shapes);
    }
  }, [coins]);

  useEffect(() => {
    if (!circles) return;
    const imageSprites: PIXI.Sprite[] = [];
    const textSprites: PIXI.Text[] = [];
    const text2Sprites: PIXI.Text[] = [];
    const circleGraphics: PIXI.Sprite[] = [];

    const app = new PIXI.Application({
      width: width,
      height,
      backgroundColor: "#0e1010",
    }) as unknown;

    const appContainer = appRef.current;

    appContainer?.appendChild((app as { view: Node }).view);
    appContainer?.children[0].addEventListener("click", (e: unknown) => BubblesUtils.handleEmptySpaceClick(e as MouseEvent, circles));

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];

      const container = PixiUtils.createContainer(circle);

      const imageSprite = PixiUtils.createImageSprite(circle);
      imageSprites.push(imageSprite);
      container.addChild(imageSprite);

      const circleGraphic = new PIXI.Sprite(PixiUtils.createGradientTexture(circle.radius * 4, circle.color));
      circleGraphic.anchor.set(0.5);
      circleGraphics.push(circleGraphic);
      container.addChild(circleGraphic);

      // Create the text
      const text = PixiUtils.createText(circle);
      container.addChild(text);
      textSprites.push(text);

      // Create the second text
      const text2 = PixiUtils.createText2(circle, PriceChangePercentage.HOUR);

      container.addChild(text2);
      text2Sprites.push(text2);

      (app as PIXI.Application<PIXI.ICanvas>).stage.addChild(container);
    }

    const ticker = BubblesUtils.update(circles, imageSprites, textSprites, text2Sprites, circleGraphics);
    setTimeout(() => {
      (app as PIXI.Application<PIXI.ICanvas>).ticker.add(ticker);
      setIsLoading(false);
    }, 200);

    return () => {
      (app as PIXI.Application<PIXI.ICanvas>).ticker.remove(ticker);
      // (app as PIXI.Application<PIXI.ICanvas>).destroy(true, true);
      appContainer?.children[0]?.removeEventListener("click", (e: unknown) => BubblesUtils.handleEmptySpaceClick(e as MouseEvent, circles));
    };
  }, [circles]);

  useEffect(() => {
    if (circles) {
      const max = maxCircleSize;
      const min = minCircleSize;

      circles.forEach((circle) => {
        if (!circle[bubbleSort]) return;

        const radius = Math.abs(Math.floor(circle[bubbleSort] * scalingFactor));
        circle.targetRadius = radius > max ? max : radius > min ? radius : min;
        circle.color = circle[bubbleSort] > 0 ? "green" : "red";
        if (circle.text2) {
          circle.text2.text = circle[bubbleSort].toFixed(2) + "%";
        }
      });
    }
  }, [bubbleSort, coins, circles, scalingFactor]);

  return (
    <div className="flex rounded px-2 overflow-hidden bg-zinc-900 md:flex-col flex-col-reverse">
      <NavigationBar bubbleSort={bubbleSort} setBubbleSort={setBubbleSort} />
      <div style={{ height: "84vh" }} className="bg-zinc-900 w-full overflow-hidden border-2 rounded border-gray-800" ref={appRef}></div>
      {isLoading && <Loader />}
    </div>
  );
}
