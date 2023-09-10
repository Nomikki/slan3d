import "@/index.scss";
import { ensure, rgbToHex, sleep } from "./utils";

export class Color {
    r = 0;
    g = 0;
    b = 0;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

export class Game {
    canvas: Element;
    ctx: CanvasRenderingContext2D;

    width: number;
    height: number;

    fontSize = 12;

    keyLeft: boolean;
    keyRight: boolean;
    keyUp: boolean;
    keyDown: boolean;
    timer2: any;
    timer1: any;


    constructor() {
        this.width = 320;
        this.height = 240;

        this.canvas = ensure(document.querySelector("#screen"));
        this.ctx = ensure((this.canvas as HTMLCanvasElement).getContext("2d"));


        this.ctx.font = `${this.fontSize}px system-ui`;

        this.keyLeft = false;
        this.keyRight = false;
        this.keyUp = false;
        this.keyDown = false;

        const ver = ensure(document.querySelector("#version"));
        const versionText = `Commit ID: ${COMMIT_HASH} | Version: ${VERSION}`;
        ver.innerHTML = versionText;

        document.addEventListener(
            "keydown",
            (event) => {
                const keyName = event.key;

                if (keyName === "a") this.keyLeft = true;
                if (keyName === "d") this.keyRight = true;
                if (keyName === "w") this.keyUp = true;
                if (keyName === "s") this.keyDown = true;

                // console.log(`Key pressed ${keyName}`);
            },
            false
        );

        document.addEventListener(
            "keyup",
            (event) => {
                const keyName = event.key;

                if (keyName === "a") this.keyLeft = false;
                if (keyName === "d") this.keyRight = false;
                if (keyName === "w") this.keyUp = false;
                if (keyName === "s") this.keyDown = false;

                // console.log(`Key released ${keyName}`);
            },
            false
        );

    }

    clear(color: Color): void {
        //Game
        this.ctx.fillStyle = rgbToHex(color.r, color.g, color.b);
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    putPixel(x: number, y: number, color: Color): void {
        const id = this.ctx.getImageData(0, 0, this.width, this.height);
        const off = (y * id.width + x) * 4;
        const pixels = id.data;

        pixels[off] = color.r;
        pixels[off + 1] = color.g;
        pixels[off + 2] = color.b;
        pixels[off + 3] = 255;

        this.ctx.putImageData(id, 0, 0);
    }

    async init() {

    }

    async GetTime(): Promise<number> {
        this.timer2 = new Date();
        const result = Math.abs(this.timer1.getTime() - this.timer2.getTime());
        this.timer1 = this.timer2;
        // console.log(result);
        return result / 1000.0;
    }

    async HandleInputs() {
        //const deltaTime = await this.GetTime();
        let leftColor = new Color(255, 255, 255);
        let rightColor = new Color(255, 255, 255);
        let upColor = new Color(255, 255, 255);
        let downColor = new Color(255, 255, 255);

        if (!this.keyLeft)
            leftColor = new Color(0, 0, 0);
        if (!this.keyRight)
            rightColor = new Color(0, 0, 0);
        if (!this.keyUp)
            upColor = new Color(0, 0, 0);
        if (!this.keyDown)
            downColor = new Color(0, 0, 0);

        this.putPixel(10, 20, leftColor);
        this.putPixel(30, 20, rightColor);
        this.putPixel(20, 10, upColor);
        this.putPixel(20, 20, downColor);
    }

    async gameLoop() {
        while (true) {
            this.clear(new Color(64, 64, 64));
            this.HandleInputs();


            // await console.log(`x ${this.player.x}, y: ${this.player.y}`);
            const targetFPS = 60;
            const fps = 1.0 / targetFPS * 1000;
            await sleep(fps);
        }
    }

    async run() {
        await this.init();
        await this.gameLoop();
    }
}

export const game = new Game();
game.run();