import * as PIXI from "pixi.js";

import { Circle, PriceChangePercentage } from "@/types/bubbles.types";

import { CoingeckoCoinData } from "@/types/coingecko.type";
import { PixiUtils } from "./pixi.utils";

export type GenerateCirclesParams = {
  coins: CoingeckoCoinData[];
  bubbleSort: PriceChangePercentage;
  scalingFactor: number;
};

export const appConfig = {
  width: typeof window !== "undefined" ? window.innerWidth : 100,
  height: typeof window !== "undefined" ? window.innerHeight * 0.85 : 100,
  speed: 0.005,
  elasticity: 0.005,
  wallDamping: 0.5,
  maxCircleSize: 300,
  minCircleSize: 15,
};

const { wallDamping, width, height, speed, elasticity, maxCircleSize, minCircleSize } = appConfig;

export class BubblesUtils {
  static createGradientTexture(radius: number, color: string) {
    const canvas = document.createElement("canvas");
    canvas.width = radius;
    canvas.height = radius;

    const context = canvas.getContext("2d")!;

    const gradient = context.createRadialGradient(radius / 2, radius / 2, 0, radius / 2, radius / 2, radius / 2);

    switch (color) {
      case "green":
        gradient.addColorStop(0, "rgba(46, 204, 113, 0)");
        gradient.addColorStop(0.42, "rgba(46, 204, 113, 0.15)");
        gradient.addColorStop(0.6, "rgba(46, 204, 113, 0.92)");
        break;
      case "red":
        gradient.addColorStop(0, "rgba(255,99,71, 0.1)");
        gradient.addColorStop(0.45, "rgba(255,99,71, 0.15)");
        gradient.addColorStop(0.6, "rgba(255,99,71, 0.95)");
        break;
    }

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(radius / 2, radius / 2, radius / 2 / 2, 0, Math.PI * 2);
    context.fill();

    return PIXI.Texture.from(canvas);
  }

  static getScalingFactor = (data: CoingeckoCoinData[], bubbleSort: PriceChangePercentage = PriceChangePercentage.HOUR): number => {
    if (!data) return 1;
    const max = data && data.map((item) => Math.abs(+item[bubbleSort]));
    let totalSquare = 0;

    for (let i = 0; i < max.length; i++) {
      const area = Math.PI * max[i] * max[i];
      totalSquare += area;
    }

    return Math.sqrt((width * height) / totalSquare) * (width > 920 ? 0.85 : 0.5);
  };

  static update = (circles: Circle[], imageSprites: PIXI.Sprite[], textSprites: PIXI.Text[], text2Sprites: PIXI.Text[], circleGraphics: PIXI.Sprite[] = []) => {
    return () => {
      for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const circleGraphic = circleGraphics[i];
        const imageSprite = imageSprites[i];
        const text = textSprites[i];
        const text2 = text2Sprites[i];

        const updateCircleChilds = () => {
          circleGraphic.texture = BubblesUtils.createGradientTexture(circle.radius * 4, circle.color);

          const fontSize = circle.radius * 0.5;
          const isFullSize = circle.radius * 0.5 < 20;
          const isTextVisible = fontSize >= 20;

          if (imageSprite) {
            imageSprite.width = circle.radius * (isFullSize ? 1.2 : 0.5);
            imageSprite.height = circle.radius * (isFullSize ? 1.2 : 0.5);
            imageSprite.position = { x: 0, y: isFullSize ? 0 : -circle.radius / 2 };
          }

          const textStyle = new PIXI.TextStyle({
            fontSize: isTextVisible ? fontSize + "px" : "1px",
            fill: "#ffffff",
          });

          const text2Style = new PIXI.TextStyle({
            fontSize: isTextVisible ? fontSize * 0.5 + "px" : "1px",
            fill: "#ffffff",
          });

          text.style = textStyle;
          text.position.y = 0.15 * circle.radius;

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

            const dampingFactor = 1 - wallDamping;
            circle.vx -= force * Math.cos(angle) * dampingFactor + circle.vx * 0.01;
            circle.vy -= force * Math.sin(angle) * dampingFactor + circle.vy * 0.01;
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
            circle.radius > circle.targetRadius ? (circle.radius -= step) : (circle.radius += step);
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

  static generateCircles = (coins: CoingeckoCoinData[], scalingFactor: number, bubbleSort: PriceChangePercentage = PriceChangePercentage.HOUR) => {
    const shapes: Circle[] = coins.map((item) => {
      const radius = Math.abs(item[bubbleSort] * scalingFactor);

      const data = {
        id: item.id,
        symbol: item.symbol.slice(0, 4),
        image: item.image,
        coinName: item.symbol,
        x: Math.random() * (width - radius * 2),
        y: Math.random() * (height - radius * 2),
        vx: Math.random() * speed * 2 - speed,
        vy: Math.random() * speed * 2 - speed,
        color: item[bubbleSort] > 0 ? "green" : "red",
        targetRadius: radius > maxCircleSize ? maxCircleSize : radius > minCircleSize ? radius : minCircleSize,
        radius: minCircleSize,
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
