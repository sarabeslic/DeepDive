import { ctx } from "../scriptLast.js";

export class Diver {
    constructor(x, y, width, height, spriteSheetUrl, frameCount, colliderWidth, colliderHeight) {
        this.position = { x, y }; //from the GameObject class
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = spriteSheetUrl;
        this.currentFrame = 0; //current frame of the animation
        this.frameCount = frameCount;//number of frames in the animation 
        this.gameFrame=0; //to slow down the animation
        this.frameWidthHeight = 200; // Assuming each frame has the same width and height
        this.collider = { width: colliderWidth, height: colliderHeight };
        //the area that will be checked for collision
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidthHeight, 0, // Source rectangle (x, y)
            this.frameWidthHeight, this.frameWidthHeight, // Source rectangle (width, height)
            this.position.x, this.position.y,        // Destination (x, y)
            this.width, this.height                   // Destination (width, height)
        );
    }

   
    update() {
        this.gameFrame++; //increment until it reaches 30
        
        //update a frame every 30 game frames
        if (this.gameFrame % 30 === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }//currentframe +1 will give us the next frame and %framecount will give us the remainder of the division of currentframe+1 and framecount
    }    
}
