"use client";

import * as PIXI from "pixi.js";
import React, { useEffect, useMemo, useState } from "react";

import { Circle, PriceChangePercentage } from "@/types/bubbles.types";
import { CoingeckoCoinData } from "@/types/coingecko.type";
import NavigationBar from "./NavigationBar";
import { BubblesUtils } from "./bubbles.utils";
import { PixiUtils } from "./pixi.utils";

type Props = {
  coins: CoingeckoCoinData[];
  page: string;
};

const width = typeof window !== "undefined" ? window.innerWidth : 100;
const height = typeof window !== "undefined" ? window.innerHeight * 0.85 : 100;
const canvas_area = width * height;
const speed = 0.005;
const MAX_CIRCLE_SIZE = 300;
const MIN_CIRCLE_SIZE = 30;

export default function Bubbles({ coins, page }: Props) {
  const [circles, setCircles] = useState<Circle[] | null>(null);
  const appRef = React.useRef<HTMLDivElement>(null);

  const [bubbleSort, setBubbleSort] = useState<PriceChangePercentage>(
    PriceChangePercentage.HOUR
  );

  const scalingFactor = useMemo(() => {
    return BubblesUtils.getScalingFactor(coins, canvas_area, bubbleSort);
  }, [coins, bubbleSort]);

  useEffect(() => {
    if (coins) {
      const scalingFactor = BubblesUtils.getScalingFactor(
        coins,
        canvas_area,
        PriceChangePercentage.HOUR
      );

      const shapes = BubblesUtils.generateCircles({
        speed,
        width,
        height,
        MAX_CIRCLE_SIZE,
        MIN_CIRCLE_SIZE,
        scalingFactor,
        bubbleSort: PriceChangePercentage.HOUR,
        coins,
      });

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
      width,
      height,
      backgroundColor: "#0e1010",
    }) as unknown;

    const appContainer = appRef.current;

    appContainer?.appendChild((app as { view: Node }).view);
    appContainer?.children[0].addEventListener("click", (e: unknown) =>
      BubblesUtils.handleEmptySpaceClick(e as MouseEvent, circles)
    );

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];

      const container = PixiUtils.createContainer(circle);
      (app as PIXI.Application<PIXI.ICanvas>).stage.addChild(container);

      const imageSprite = PixiUtils.createImageSprite(circle);
      imageSprites.push(imageSprite);
      container.addChild(imageSprite);

      const circleGraphic = new PIXI.Sprite(
        BubblesUtils.createGradientTexture(circle.radius * 4, circle.color)
      );
      circleGraphic.anchor.set(0.5);
      circleGraphics.push(circleGraphic);
      container.addChild(circleGraphic);

      // Create the text
      const text = PixiUtils.createText(circle);
      container.addChild(text);
      textSprites.push(text);

      // Create the second text
      const text2 = PixiUtils.createText2(circle, bubbleSort);

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

      const handleMouseUp = (index: number) =>
        (circles[index].dragging = false);
      const handleMouseDown = () => (circles[i].dragging = true);

      container
        // .on("click", () => handleCircleClick(i))
        .on("mousedown", () => handleMouseDown())
        .on("mousemove", (e: MouseEvent) =>
          BubblesUtils.handleMouseMove(e, circles)
        )
        .on("mouseup", () => handleMouseUp(i))
        .on("mouseupoutside", () => handleMouseUp(i))
        // .on("tap", () => handleCircleClick(i))
        .on("touchstart", () => handleMouseDown())
        .on("touchmove", (e: PointerEvent) =>
          BubblesUtils.handleMouseMove(e, circles)
        )
        .on("touchend", () => handleMouseUp(i))
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
    }

    const ticker = BubblesUtils.update(
      circles,
      imageSprites,
      textSprites,
      text2Sprites,
      circleGraphics
    );
    (app as PIXI.Application<PIXI.ICanvas>).ticker.add(ticker);

    return () => {
      (app as PIXI.Application<PIXI.ICanvas>).ticker.remove(ticker);
      (app as PIXI.Application<PIXI.ICanvas>).destroy(true, true);
      appContainer?.children[0]?.removeEventListener("click", (e: unknown) =>
        BubblesUtils.handleEmptySpaceClick(e as MouseEvent, circles)
      );
    };
  }, [circles]);

  useEffect(() => {
    if (circles && scalingFactor && bubbleSort) {
      const max = MAX_CIRCLE_SIZE;
      const min = MIN_CIRCLE_SIZE;

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
  }, [bubbleSort, circles, scalingFactor]);

  return (
    <div className="rounded p-2 overflow-hidden bg-zinc-900">
      <NavigationBar page={page} setBubbleSort={setBubbleSort} />
      <div className="overflow-hidden">
        <div style={{ width: "100%", height: "85vh" }} className="bg-zinc-900">
          <div ref={appRef}></div>
        </div>
      </div>
    </div>
  );
}
