import * as PIXI from "pixi.js";

import { Circle, PriceChangePercentage } from "@/types/bubbles.types";

import { CoingeckoCoinData } from "@/types/coingecko.type";
import { PixiUtils } from "./pixi.utils";

export type GenerateCirclesParams = {
  coins: CoingeckoCoinData[];
  bubbleSort: PriceChangePercentage;
  scalingFactor: number;
  width: number;
  height: number;
  speed: number;
  MAX_CIRCLE_SIZE: number;
  MIN_CIRCLE_SIZE: number;
};

export class BubblesUtils {
  static createGradientTexture(radius: number, color: string) {
    const canvas = document.createElement("canvas");
    canvas.width = radius;
    canvas.height = radius;

    const context = canvas.getContext("2d")!;

    const gradient = context.createRadialGradient(
      radius / 2,
      radius / 2,
      0,
      radius / 2,
      radius / 2,
      radius / 2
    );

    switch (color) {
      case "green":
        gradient.addColorStop(0, "rgba(0, 255, 0, 0)");
        gradient.addColorStop(0.42, "rgba(0, 255, 0, 0.15)");
        gradient.addColorStop(0.6, "rgba(0, 255, 0, 0.95)");
        break;
      case "red":
        gradient.addColorStop(0, "rgba(255, 0, 0, 0)");
        gradient.addColorStop(0.45, "rgba(255, 0, 0, 0.15)");
        gradient.addColorStop(0.6, "rgba(255, 0, 0, 0.95)");
        break;
    }

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(radius / 2, radius / 2, radius / 2 / 2, 0, Math.PI * 2);
    context.fill();

    return PIXI.Texture.from(canvas);
  }

  static getScalingFactor = (
    data: CoingeckoCoinData[],
    canvas_area: number,
    bubbleSort: PriceChangePercentage
  ): number => {
    if (!data) return 1;
    const max = data && data.map((item) => Math.abs(+item[bubbleSort]));
    let totalSquare = 0;

    for (let i = 0; i < max.length; i++) {
      const area = Math.PI * max[i] * max[i];
      totalSquare += area;
    }

    return Math.sqrt(canvas_area / totalSquare) * 0.7;
  };

  static update = (
    circles: Circle[],
    imageSprites: PIXI.Sprite[],
    textSprites: PIXI.Text[],
    text2Sprites: PIXI.Text[],
    circleGraphics: PIXI.Sprite[] = []
  ) => {
    return () => {
      const width =
        typeof window !== "undefined" ? window.innerWidth - 30 : 100;
      const height =
        typeof window !== "undefined" ? window.innerHeight * 0.85 : 100;
      const elasticity = 1;
      const collisionDamping = 0.99;
      const wallDamping = 0.5;

      for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const circleGraphic = circleGraphics[i];
        const imageSprite = imageSprites[i];
        const text = textSprites[i];
        const text2 = text2Sprites[i];

        const updateCircleChilds = () => {
          circleGraphic.texture = BubblesUtils.createGradientTexture(
            circle.radius * 4,
            circle.color
          );

          if (imageSprite) {
            imageSprite.width = circle.radius * 0.5;
            imageSprite.height = circle.radius * 0.5;
            imageSprite.position.y = -circle.radius / 2;
          }

          const textStyle = new PIXI.TextStyle({
            fontSize: circle.radius * 0.6,
            fill: "#ffffff",
          });
          text.style = textStyle;
          text.position.y = 0.15 * circle.radius;

          const startFontSize = circle.radius * 0.3;

          const fontSize =
            startFontSize > 60 ? 60 : startFontSize < 15 ? 15 : startFontSize;

          const text2Style = new PIXI.TextStyle({
            fontSize: fontSize + "px",
            fill: "#ffffff",
          });
          text2.style = text2Style;
          text2.position.y = circle.radius / 1.5;
        };

        // Update circle position
        circle.x += circle.vx;
        circle.y += circle.vy;

        // Check for collisions with walls
        if (circle.x - circle.radius < 0) {
          circle.x = circle.radius; // Keep the circle inside the left wall
          circle.vx *= -1;
          circle.vx *= 1 - wallDamping; // Apply wall damping
        } else if (circle.x + circle.radius > width) {
          circle.x = width - circle.radius; // Keep the circle inside the right wall
          circle.vx *= -1;
          circle.vx *= 1 - wallDamping; // Apply wall damping
        }
        if (circle.y - circle.radius < 0) {
          circle.y = circle.radius; // Keep the circle inside the top wall
          circle.vy *= -1;
          circle.vy *= 1 - wallDamping; // Apply wall damping
        } else if (circle.y + circle.radius > height) {
          circle.y = height - circle.radius; // Keep the circle inside the bottom wall
          circle.vy *= -1;
          circle.vy *= 1 - wallDamping; // Apply wall damping
        }

        // Check for collisions with other circles
        for (let j = i + 1; j < circles.length; j++) {
          const otherCircle = circles[j];
          const dx = otherCircle.x - circle.x;
          const dy = otherCircle.y - circle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < circle.radius + otherCircle.radius) {
            // Colliding circles
            const angle = Math.atan2(dy, dx);

            // Calculate the new velocities after collision with elasticity
            const totalRadius = circle.radius + otherCircle.radius;
            const overlap = totalRadius - distance;
            const force = overlap * elasticity;

            const dampingFactor = 1 - collisionDamping;
            circle.vx -=
              force * Math.cos(angle) * dampingFactor + circle.vx * 0.01;
            circle.vy -=
              force * Math.sin(angle) * dampingFactor + circle.vy * 0.01;
            otherCircle.vx += force * Math.cos(angle) * dampingFactor;
            otherCircle.vy += force * Math.sin(angle) * dampingFactor;
          }
        }

        // Update container position
        const container = circleGraphic.parent as PIXI.Container;
        container.x = circle.x;
        container.y = circle.y;
        container.hitArea = new PIXI.Circle(0, 0, circle.radius);

        // Smoothly change the size of the circle
        if (circle.radius !== circle.targetRadius) {
          const sizeDifference = circle.targetRadius - circle.radius;
          const step = 1;

          if (Math.abs(sizeDifference) <= step) {
            circle.radius = circle.targetRadius;
            updateCircleChilds();
          } else {
            circle.radius > circle.targetRadius
              ? (circle.radius -= step)
              : (circle.radius += step);
            updateCircleChilds();
          }
        }
      }
    };
  };

  static handleEmptySpaceClick = (event: MouseEvent, circles: Circle[]) => {
    const waveForce = 100; // Adjust the wave force as needed

    circles.forEach((circle) => {
      const dx = circle.x - event.clientX;
      const dy = circle.y - event.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Apply a force to push the balls away from the click point
      circle.vx += (waveForce * Math.cos(angle)) / distance;
      circle.vy += (waveForce * Math.sin(angle)) / distance;
    });
  };

  static handleMouseMove = (event: MouseEvent, circles: Circle[]) => {
    const index = circles.findIndex((circle) => circle.dragging);

    if (index !== -1) {
      const circle = circles[index];

      // Calculate the velocity based on mouse movement
      const dx = event.clientX - circle.x;
      const dy = event.clientY - circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 3; // Adjust the speed factor as needed
      circle.vx = (dx / distance) * speed;
      circle.vy = (dy / distance) * speed;
    }
  };

  static generateCircles = (params: GenerateCirclesParams) => {
    const {
      coins,
      bubbleSort,
      scalingFactor,
      width,
      height,
      speed,
      MAX_CIRCLE_SIZE,
      MIN_CIRCLE_SIZE,
    } = params;

    const shapes: Circle[] = coins.map((item) => {
      const radius = Math.abs(item[bubbleSort] * scalingFactor);

      const data = {
        symbol: item.symbol.slice(0, 4),
        image: item.image,
        coinName: item.symbol,
        x: Math.random() * (width - radius * 2),
        y: Math.random() * (height - radius * 2),
        vx: Math.random() * speed * 2 - speed,
        vy: Math.random() * speed * 2 - speed,
        color: item[bubbleSort] > 0 ? "green" : "red",
        targetRadius:
          radius > MAX_CIRCLE_SIZE
            ? MAX_CIRCLE_SIZE
            : radius > MIN_CIRCLE_SIZE
            ? radius
            : MIN_CIRCLE_SIZE,
        radius: MIN_CIRCLE_SIZE,
        dragging: false,
        text2: null,
        [PriceChangePercentage.HOUR]: item[PriceChangePercentage.HOUR],
        [PriceChangePercentage.DAY]: item[PriceChangePercentage.DAY],
        [PriceChangePercentage.WEEK]: item[PriceChangePercentage.WEEK],
        [PriceChangePercentage.MONTH]: item[PriceChangePercentage.MONTH],
        [PriceChangePercentage.YEAR]: item[PriceChangePercentage.YEAR],
      };

      const shape = { ...data, text2: PixiUtils.createText2(data, bubbleSort) };

      return shape;
    });

    return shapes;
  };
}
