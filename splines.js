var Splines = function(canvas) {

    // control points are stored in 2 arrays:
    this.ctrlX = [10,  20,  200,  200]; // x coordinates
    this.ctrlY = [10,  50,   60,   10]; // y coordinates

    // Task 1a: fill in the Bezier control matrix
    this.B = new SimplerMatrix(
      0,  0,  0,  0,
      0,  0,  0,  0,
      0,  0,  0,  0,
      0,  0,  0,  0);

    this.dragIndex = -1; // for UI purposes
}

Splines.prototype.render = function(canvas, w, h)
{
    // Task 1b: precompute the polynomial coefficients (a_i) for the curve
    //this.Ax = (complete this line)
    //this.Ay = (complete this line)
    var context = canvas.getContext('2d');

    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw the four control points as blue circles
    context.beginPath();
    context.fillStyle = 'blue';
    context.strokeStyle = 'blue';
    for (i = 0; i < 4; i++) {
        var x = this.ctrlX[i];
        var y = this.ctrlY[i];
        context.moveTo(x, y);
        context.arc(this.ctrlX[i], this.ctrlY[i], 4, 0, 2 * Math.PI);
    }
    context.fill();

    //// draw dots on the curve using direct evalution (red dots)
    //// After completing Task 1, uncomment this block.
    //context.beginPath();
    //context.fillStyle = 'red';
    //for (t = 0.05; t < 1.0; t += 0.1) {
      //pt = this.eval_direct(t);
      //context.fillRect(pt[0]-1, pt[1]-1, 3, 3);
    //}
    //context.fill();

    //// After completing Task 2, uncomment this block:
    //// draw dots on the curve using de Casteljau's algorithm (green dots)
    //context.beginPath();
    //context.fillStyle = 'green';
    //for (t = 0.1; t < 0.99; t += 0.1) {
      //pt = this.eval_dcj(t);
      //context.fillRect(pt[0]-1, pt[1]-1, 3, 3);
    //}
    //context.fill();

    //// After completing rask 3, uncomment this block:
    //// draw a piecewise linear approximation to the curve by recursively
    //// subidividing it with de Castelau's algorithm (black line)
    //context.beginPath();
    //context.strokeStyle = 'black';
    //this.draw_dcj(context, this.ctrlX, this.ctrlY, 8);
    //context.stroke()
}

/* Return an array [x, y] containing the coordinates of the point
 * on the curve at parameter value t using using direct evaluation. */
Splines.prototype.eval_direct = function(t) {
  // Task 1c: implement this method

  // your code here

  //return [px, py];
}

/* Helper: return a linearly interpolated value between x and y.
 * Precondition: t is between 0 and 1. */
function lerp(x, y, t) {
    return (1-t) * x + t * y;
}

/* Return an array [x, y] containing the coordinates of the point on the
 * curve at parameter value t using using de Casteljau's algorithm.. */
Splines.prototype.eval_dcj = function(t) {
    // Task 2: complete this method. Remember that you don't need the control
    // matrix for this - it's just a sequence of linear interpolations.
    // I got it started for you:
    var cx = this.ctrlX;
    var cy = this.ctrlY;
    var x12 = lerp(cx[0], cx[1], t);
    var y12 = lerp(cy[0], cy[1], t);
    // your code here

}

/* Helper: return the cosine of the angle at b formed by the points a, b, c */
function cos_angle(ax, ay, bx, by, cx, cy) {
    // compute a-b, c-b
    var bax = ax - bx;
    var bay = ay - by;
    var bcx = cx - bx;
    var bcy = cy - by;
    // normalize them
    var baMag = Math.sqrt(bax*bax + bay*bay);
    bax /= baMag;
    bay /= baMag;
    var bcMag = Math.sqrt(bcx*bcx + bcy*bcy);
    bcx /= bcMag;
    bcy /= bcMag;
    // I miss julia: dot(normalize(a-b), normalize(c-b))
    return bax * bcx + bay * bcy;
}

Splines.prototype.draw_dcj = function(context, cx, cy, maxDepth) {
    // base case - completed for you. If the curve is straight enough,
    // simply draw three line  segments connecting the four control points.
    var cos123 = cos_angle(cx[0], cy[0], cx[1], cy[1], cx[2], cy[2]);
    var cos234 = cos_angle(cx[1], cy[1], cx[2], cy[2], cx[3], cy[3]);

    if ((cos123 < -0.999 && cos234 < -0.999) || maxDepth <= 0) {
        context.moveTo(cx[0], cy[0]);
        context.lineTo(cx[1], cy[1]);
        context.lineTo(cx[2], cy[2]);
        context.lineTo(cx[3], cy[3]);
        return;
    }

    // Task 3 - using the curve's four points, subdivide the curve into two
    // sets of four new control points; then, recursively call this method on
    // each set of control points to draw a piecewise linear approximation of
    // each half. I got it started for you:
    var t = 0.5;

    var x12 = lerp(cx[0], cx[1], t);
    var y12 = lerp(cy[0], cy[1], t);
    // your code here
}

/***********************************************\
/* end of lab code; beginning of setup/UI code *|
\***********************************************/

Splines.prototype.startDrag = function(canvas, e) {
  rect = canvas.getBoundingClientRect();
  x = event.clientX - rect.left;
  y = event.clientY - rect.top;

  // find the closest control point to the mouse
  md = Infinity;
  for (i = 0; i < 4; i++) {
    cpx = this.ctrlX[i];
    cpy = this.ctrlY[i];
    d = (cpx - x)**2 + (cpy - y)**2;
    if (d < md) {
      md = d;
      mi = i;
    }
  }

  // update control point's position and set up for dragging
  this.dragIndex = mi;
  this.ctrlX[mi] = x;
  this.ctrlY[mi] = y;

  //console.log("start drag point " + mi);
  //canvas.addEventListener("mousemove", () => this.drag(canvas, e));
}

Splines.prototype.drag = function(canvas, e) {
  if (this.dragIndex >= 0) {
    rect = canvas.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;

    this.ctrlX[this.dragIndex] = x;
    this.ctrlY[this.dragIndex] = y;

  }
}

Splines.prototype.stopDrag = function(e) {
  this.dragIndex = -1;
}

function setup(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.log("Could not find canvas with id", canvasId);
        return;
    }

    var renderWidth, renderHeight;
    function computeCanvasSize() {
        renderWidth = Math.min(canvas.parentNode.clientWidth - 20, 820);
        renderHeight = Math.floor(renderWidth*9.0/16.0);
        canvas.width = renderWidth;
        canvas.height = renderHeight;
    }

    window.addEventListener('resize', computeCanvasSize);
    computeCanvasSize();

    var demo = new Splines(canvas);

    canvas.addEventListener('mousedown', function(e) { demo.startDrag(canvas, e); })
    canvas.addEventListener('mousemove', function(e) { demo.drag(canvas, e); })
    canvas.addEventListener('mouseup', function(e) { demo.stopDrag(canvas, e); })
    canvas.addEventListener('mouseout', function(e) { demo.stopDrag(canvas, e); })

    var renderLoop = function() {
        demo.render(canvas, renderWidth, renderHeight);
        window.requestAnimationFrame(renderLoop);
    }
    window.requestAnimationFrame(renderLoop);

    return demo;
}
