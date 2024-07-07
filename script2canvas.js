function createObstacleCanvas(canvas){
    // Create a separate canvas for obstacles
    const obstacleCanvas = document.createElement("canvas");
    obstacleCanvas.width = canvas.width;
    obstacleCanvas.height = canvas.height;
    return obstacleCanvas.getContext("2d");
}
//------------------------------------------------------------------------------------------------------

export { createObstacleCanvas };