"use client";

import * as PIXI from "pixi.js";
import React, { useEffect, useState } from "react";

import { Circle, PriceChangePercentage } from "@/types/bubbles.types";
import { CoingeckoCoinData } from "@/types/coingecko.type";
import { useRouter } from "next/navigation";
import Loader from "../Loader/Loader";
import NavigationBar from "./NavigationBar";
import { BubblesUtils, appConfig } from "./bubbles.utils";
import { PixiUtils } from "./pixi.utils";

type Props = {
  coins: CoingeckoCoinData[];
  page: string;
};

const { width, height, maxCircleSize, minCircleSize } = appConfig;

export default function Bubbles({ coins = [], page }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const [circles, setCircles] = useState<Circle[] | null>(null);
  const [bubbleSort, setBubbleSort] = useState(PriceChangePercentage.HOUR);

  const appRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scalingFactor = BubblesUtils.getScalingFactor(coins);
    const shapes = BubblesUtils.generateCircles(coins, scalingFactor);

    setCircles(shapes);
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

      const handleMouseOver = (event: PointerEvent) => {
        const target = event.target as unknown;
        (target as { cursor: string }).cursor = "pointer";
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xffffff);
        graphics.drawCircle(0, 0, circle.radius + 2);
        container.addChild(graphics);
      };

      const handleMouseOut = (event: PointerEvent) => {
        const target = event.target as unknown;
        (target as { cursor: string }).cursor = "default";
        container.children.pop();
      };

      const handleMouseUp = (index: number) => (circles[index].dragging = false);
      const handleMouseDown = () => (circles[i].dragging = true);

      const handleCircleClick = (i: number) => {
        const { id } = circles[i];
        router.push(`/coin/${id}`);
      };

      container
        .on("click", () => handleCircleClick(i))
        .on("mousedown", () => handleMouseDown())
        .on("mousemove", (e: MouseEvent) => BubblesUtils.handleMouseMove(e, circles))
        .on("mouseup", () => handleMouseUp(i))
        .on("mouseupoutside", () => handleMouseUp(i))
        .on("tap", () => handleCircleClick(i))
        .on("touchstart", () => handleMouseDown())
        .on("touchmove", (e: PointerEvent) => BubblesUtils.handleMouseMove(e, circles))
        .on("touchend", () => handleMouseUp(i))
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
    }
    setIsLoading(false);

    const ticker = BubblesUtils.update(circles, imageSprites, textSprites, text2Sprites, circleGraphics);
    (app as PIXI.Application<PIXI.ICanvas>).ticker.add(ticker);

    return () => {
      (app as PIXI.Application<PIXI.ICanvas>).ticker.remove(ticker);
      (app as PIXI.Application<PIXI.ICanvas>).destroy(true, true);
      appContainer?.children[0]?.removeEventListener("click", (e: unknown) => BubblesUtils.handleEmptySpaceClick(e as MouseEvent, circles));
    };
  }, [circles, router]);

  useEffect(() => {
    const scalingFactor = BubblesUtils.getScalingFactor(coins, bubbleSort);

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
  }, [bubbleSort, coins, circles]);

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
