import { GameObject } from "./GameObject.js";
import { ctx } from "../scriptLast.js";

export class Animal extends GameObject {
    constructor(x, y, speed, row, spriteSheetUrl) {
        super(x, y);
        this.speed = speed;
        this.row = row; // Row in the sprite sheet for this animal
        this.frame = 0; // Current frame of animation
        this.spriteSheetAnimals = new Image();
        this.spriteSheetAnimals.src = spriteSheetUrl; // sprite sheet URL
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.gameFrame = 0;//used to slow down the animation
        this.isActive = true; // This will be set to false when the animal is out of the canvas
    }

    update() {
        this.x -= this.speed; // This moves the animal to the left
        this.gameFrame++;

        // Check if the animal is out of the canvas, reset its position
        if (this.x + this.spriteWidth < 0) {
            this.isActive = false;
        }
        if (this.gameFrame % 55 === 0) {
            this.frame = (this.frame + 1) % 2; // Assuming 2 frames per row, %2 will give back 0 or 1
        }
    }
    draw() {
        ctx.drawImage(
            this.spriteSheetAnimals,
            this.frame * this.spriteWidth, this.row * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, // Crop from the sprite sheet
            this.x, this.y,
            110, 110,
        );
    }//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
}
