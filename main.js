class Rect {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color
    }
}
  
let width;
let height;
const colors = ["blue", "purple", "green", "orange", "maroon", "lightpink"];

xv = yv = 0;
gravity = 0.9;
runningSpeed = 3;
jumpHeight = -17;
rightKey = leftKey = upKey = false;
const rect1 = new Rect(200,250,10,20);
isPlaying = false;

$(function(){
    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");

    var $canvas=$("#canvas");
    var canvasOffset=$canvas.offset();
    var offsetX=canvasOffset.left;
    var offsetY=canvasOffset.top;

    var isMouseDown=false;
    var mouseStartX;
    var mouseStartY;

    var rects = [];
    const ul = document.querySelector('.rect-list');
    setInterval(update, 20);

    function update(){
        if(isPlaying)
        {
            physics();
            // Draw background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "red";
            ctx.fillRect(rect1.x, rect1.y, rect1.width, rect1.height);
        }

        // Draw platforms
        for(let i= 0; i < rects.length; i++)
        {
            ctx.fillStyle = rects[i].color;
            ctx.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
        }
    }

    function physics() {
    // Respawn
    if (yv > 60) {
        rect1.x = 200;
        rect1.y = 200;
        yv = 0;
    }

    // Movement in the y
    yv += gravity;
    rect1.y += yv;
    if (isCollision(rect1, rects)) {
        while (isCollision(rect1, rects)) {
        rect1.y += ((Math.abs(yv) / yv) * -1);
        }
        if (Math.abs(yv) / yv == 1 && upKey) {
        yv = jumpHeight;
        } else {
        yv = 0;
        }
    }

    // Movement in the x
    if (leftKey) {
        xv -= runningSpeed;
    }
    if (rightKey) {
        xv += runningSpeed;
    }
    xv = (xv * 0.8);
    rect1.x = (xv + rect1.x);
    _slope = 0;
    _slope++;
    if (isCollision(rect1, rects)) {
        rect1.y -= _slope;
        while (isCollision(rect1, rects)) {
        rect1.x += ((Math.abs(xv) / xv) * -1);
        }
    }
    }

    // Check collision
    function isCollision(player, obstacles) {
    for(let i = 0; i < obstacles.length; i++)
    {
        if (player.x < obstacles[i].x + obstacles[i].width &&
        player.x + player.width > obstacles[i].x &&
        player.y < obstacles[i].y + obstacles[i].height &&
        player.y + player.height > obstacles[i].y) {
            return true;
        }
    }
    return false;
    }

    ul.addEventListener('click', function(e) {
        let index = e.target.id
        this.removeChild(this.children[index]);
        const removed = rects.splice(index, 1)[0];
        ctx.clearRect(removed.x,removed.y,removed.width,removed.height);
    })

    function handleMouseDown(e){
        if(isPlaying) return;

        e.preventDefault();
        e.stopPropagation();
        isMouseDown=true;
        mouseStartX=parseInt(e.clientX-offsetX);
        mouseStartY=parseInt(e.clientY-offsetY);
    }

    function handleMouseUp(e){
        e.preventDefault();
        e.stopPropagation();
        addPlatform();
        isMouseDown=false;
    }

    function handleMouseOut(e){
        e.preventDefault();
        e.stopPropagation();
        addPlatform();
        isMouseDown=false;
    }

    function addPlatform()
    {
        // Check that a rectangle is being drawn
        if(isMouseDown)
        {
            let li = document.createElement('li');
            let i = rects.length
            if(width <= 0){
                mouseStartX = mouseStartX + width;
                width = Math.abs(width);
            }
            if(height <= 0){
                mouseStartY = mouseStartY + height;
                height = Math.abs(height);
            }

            rects.push(new Rect(mouseStartX,mouseStartY,width,height, colors[i%colors.length]))


            li.innerHTML = (`<button id=${i}>Rectangle x:${rects[i].x}, y:${rects[i].y}, width:${rects[i].width}, height:${rects[i].height}, color:${rects[i].color}</button>`)
            ul.appendChild(li);
        }
    }

    function handleMouseMove(e){
        e.preventDefault();
        e.stopPropagation();

        if(!isMouseDown) return;
        mouseX=parseInt(e.clientX-offsetX);
        mouseY=parseInt(e.clientY-offsetY);

        // Draw in new platforms
        // Clear the previous rect
        ctx.clearRect(mouseStartX,mouseStartY,width,height);

        // Draw the new rect
        width=mouseX-mouseStartX;
        height=mouseY-mouseStartY;
        let i = rects.length
        ctx.fillStyle = colors[i%colors.length]
        ctx.fillRect(mouseStartX,mouseStartY,width,height);
    }

    function keyDown(e) {
        if (e.keyCode == 65)
          leftKey = true;
        if (e.keyCode == 87 || e.keyCode == 32)
          upKey = true;
        if (e.keyCode == 68)
          rightKey = true;
      }
    
      function keyUp(e) {
        if (e.keyCode == 65) {
          leftKey = false;
        }
        if (e.keyCode == 87 || e.keyCode == 32) {
          upKey = false;
        }
        if (e.keyCode == 68) {
          rightKey = false;
        }
      }

    // Event listeners
    $("#canvas").mousedown(function(e){handleMouseDown(e)});
    $("#canvas").mousemove(function(e){handleMouseMove(e)});
    $("#canvas").mouseup(function(e){handleMouseUp(e)});
    $("#canvas").mouseout(function(e){handleMouseOut(e)});
    document.addEventListener('keydown', function(e) {keyDown(e)})
    document.addEventListener('keyup', function(e) {keyUp(e)})
    $("#play").mousedown(function(e){
        isPlaying = !isPlaying;
        $("#play").text(isPlaying ? "Pause" : "Play");
    })
});