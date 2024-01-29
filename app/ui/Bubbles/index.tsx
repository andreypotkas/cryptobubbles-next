"use client";

import * as PIXI from "pixi.js";
import React, { useEffect, useMemo, useState } from "react";

import { Circle, PriceChangePercentage } from "@/types/bubbles.types";
import { CoingeckoCoinData } from "@/types/coingecko.type";
import { BubblesUtils, appConfig } from "../../lib/bubbles.utils";
import { PixiUtils } from "../../lib/pixi.utils";
import Loader from "../Loader/Loader";
import NavigationBar from "./NavigationBar";

type Props = {
  coins: CoingeckoCoinData[];
  page: string;
};

const { width, height, maxCircleSize, minCircleSize } = appConfig;

export default function Bubbles({ coins = [], page }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [circles, setCircles] = useState<Circle[] | null>(null);
  const [bubbleSort, setBubbleSort] = useState(PriceChangePercentage.HOUR);

  const appRef = React.useRef<HTMLDivElement>(null);

  const scalingFactor = useMemo(() => {
    return BubblesUtils.getScalingFactor(coins, bubbleSort);
  }, [bubbleSort, coins]);

  useEffect(() => {
    const scalingFactor = BubblesUtils.getScalingFactor(coins, PriceChangePercentage.HOUR);

    if (coins && scalingFactor) {
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
      (app as PIXI.Application<PIXI.ICanvas>).stage.addChild(container);

      const imageSprite = PixiUtils.createImageSprite(circle);
      imageSprites.push(imageSprite);
      container.addChild(imageSprite);

      const circleGraphic = new PIXI.Sprite(BubblesUtils.createGradientTexture(circle.radius * 4, circle.color));
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
    }
    setIsLoading(false);

    const ticker = BubblesUtils.update(circles, imageSprites, textSprites, text2Sprites, circleGraphics);
    (app as PIXI.Application<PIXI.ICanvas>).ticker.add(ticker);

    return () => {
      (app as PIXI.Application<PIXI.ICanvas>).ticker.remove(ticker);
      (app as PIXI.Application<PIXI.ICanvas>).destroy(true, true);
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
    <div className="rounded p-2 overflow-hidden bg-zinc-900">
      <NavigationBar bubbleSort={bubbleSort} page={page} setBubbleSort={setBubbleSort} />
      <div className="overflow-hidden">
        <div style={{ width: "100%", height: "85vh" }} className="bg-zinc-900">
          <div ref={appRef}></div>
          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
}
