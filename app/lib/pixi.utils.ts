import * as PIXI from "pixi.js";

import { Circle, PriceChangePercentage } from "@/types/bubbles.types";

export class PixiUtils {
  static createContainer = (circle: Circle) => {
    const container = new PIXI.Container();
    container.x = circle.x;
    container.y = circle.y;
    container.hitArea = new PIXI.Circle(0, 0, circle.radius);
    container.eventMode = "none";
    return container;
  };

  static createImageSprite = (circle: Circle) => {
    const imageSprite = PIXI.Sprite.from(`/assets/coins/${circle.id}.png`);
    const isFullSize = circle.radius * 0.3 < 10;

    imageSprite.anchor.set(0.5);
    imageSprite.width = circle.radius * (isFullSize ? 1.2 : 0.5);
    imageSprite.height = circle.radius * (isFullSize ? 1.2 : 0.5);
    imageSprite.position = { x: 0, y: isFullSize ? 0 : -circle.radius / 2 };
    return imageSprite;
  };

  static createText = (circle: Circle) => {
    const fontSize = circle.radius * 0.3;
    const isTextVisible = fontSize > 10;

    const textStyle = new PIXI.TextStyle({
      fontSize: isTextVisible ? fontSize + "px" : 0,
      fill: "#ffffff",
    });

    const text = new PIXI.Text(circle.symbol.toUpperCase(), textStyle);
    text.anchor.set(0.5);
    text.position.y = 0.15 * circle.radius;
    return text;
  };

  static createText2 = (circle: Circle, bubbleSort: PriceChangePercentage) => {
    const fontSize = circle.radius * 0.3;
    const isTextVisible = fontSize > 10;

    const text2Style = new PIXI.TextStyle({
      fontSize: isTextVisible ? fontSize + "px" : 0,
      fill: "#ffffff",
    });

    const data = circle[bubbleSort] ? circle[bubbleSort].toFixed(2) + "%" : "No data";

    const text2 = new PIXI.Text(data, text2Style);
    text2.anchor.set(0.5);
    text2.position.y = circle.radius / 1.5;
    circle["text2"] = text2;

    return text2;
  };
}
