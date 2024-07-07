import { ctx, obstacleCtx, gameSpeed, backgroundMask } from "../scriptLast.js";

export class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 1600;
        this.height = 665;
        this.x2 = this.width; //our second image start at the end of first
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;  //eg. 3*0,1=0,3
    } //this alows us to create different speeds but the speeds will be tied to our game speed

    update() { //this will update the position of our layer
        this.speed = gameSpeed * this.speedModifier;
        this.x = Math.floor(this.x - this.speed);
        this.x2 = Math.floor(this.x2 - this.speed);

        // Adjust the position for seamless looping
        if (this.x <= -this.width) {
            this.x = this.width + this.x2;

        }
        if (this.x2 <= -this.width) {
            this.x2 = this.width + this.x;
        }

    }

    draw() {//this draws the mask separately(on it's own canvas) from the rest of the layers so that pixel detection works
        if (this.image.id === backgroundMask.id) {
            obstacleCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
            obstacleCtx.drawImage(this.image, this.x2, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
        }
    }
    reset() { //this will reset the position of the layers
        this.x = 0;
        this.x2 = this.width;
    }
}

