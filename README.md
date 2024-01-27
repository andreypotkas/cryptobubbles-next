# CryptoBubbles Pixi.js Next.js 14

Сryptobubbles is an application for monitoring cryptocurrency price changes over different periods of time.
The application implemented using Next.js framework with Typescript. For interactive animation I use Pixi.js. Shadcn UI and tailwind for styling.

### Features

- Interactive animation using Pixi.js: text, sprite, texture, gradient, collision.
- Click on an empty space to disperse the balls.
- Ability to switch the period of time to change view or page to load new coins.
- Request data from coingecko API.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/andreypotkas/cryptobubbles-next.git
   cd cryptobubbles-next
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run:**

   ```bash
   npm run dev
   # or
   yarn dev

   ```

### Configuration

```env
COINGECKO_API_SECRET_KEY=
```
