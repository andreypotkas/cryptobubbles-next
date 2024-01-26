import * as PIXI from "pixi.js";

import { Circle, PriceChangePercentage } from "@/types/bubbles.types";

export class PixiUtils {
  static createContainer = (circle: Circle) => {
    const container = new PIXI.Container();
    container.x = circle.x;
    container.y = circle.y;
    container.hitArea = new PIXI.Circle(0, 0, circle.radius);
    container.interactive = true;
    return container;
  };

  static createImageSprite = (circle: Circle) => {
    const imageSprite = PIXI.Sprite.from(circle.image);

    imageSprite.anchor.set(0.5);
    imageSprite.width = circle.radius * 0.5;
    imageSprite.height = circle.radius * 0.5;
    imageSprite.position = { x: 0, y: -circle.radius / 2 };
    return imageSprite;
  };

  static createText = (circle: Circle) => {
    const startFontSize = circle.radius * 0.3;

    const fontSize =
      startFontSize > 50 ? 50 : startFontSize < 25 ? 20 : startFontSize;

    const textStyle = new PIXI.TextStyle({
      fontSize: fontSize + "px",
      fill: "#ffffff",
    });
    const text = new PIXI.Text(circle.symbol.toUpperCase(), textStyle);
    text.anchor.set(0.5);
    text.position.y = 0.15 * circle.radius;
    return text;
  };

  static createText2 = (circle: Circle, bubbleSort: PriceChangePercentage) => {
    const startFontSize = circle.radius * 0.3;

    const fontSize =
      startFontSize > 40 ? 40 : startFontSize < 15 ? 15 : startFontSize;

    const text2Style = new PIXI.TextStyle({
      fontSize: fontSize + "px",
      fill: "#ffffff",
    });

    const data = circle[bubbleSort]
      ? circle[bubbleSort].toFixed(2) + "%"
      : "No data";

    const text2 = new PIXI.Text(data, text2Style);
    text2.anchor.set(0.5);
    text2.position.y = circle.radius / 1.5;
    circle["text2"] = text2;

    return text2;
  };
}
