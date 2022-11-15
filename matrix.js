/*
    lightgl.js matrix class
    https://github.com/evanw/lightgl.js/

    Copyright (C) 2011 by Evan Wallace

    Simplified and modified by Scott Wehrwein, 2021.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

var hasFloat32Array = (typeof Float32Array != 'undefined');


function SimplerMatrix() {
    var m = Array.prototype.concat.apply([], arguments);
    if (!m.length) {
        m = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }
    this.m = hasFloat32Array ? new Float32Array(m) : m;
}

SimplerMatrix.prototype = {
  multiplyVector: function(vector) {
    return SimplerMatrix.multiplyVector(this, vector);
  }
};

SimplerMatrix.multiplyVector = function(matrix, vector)
{
    var newVector = [0, 0, 0, 0];

    m = matrix.m;
    v = vector;
    newVector[0] = m[0]*v[0] + m[1]*v[1] + m[2]*v[2] + v[3]*m[3];
    newVector[1] = m[4]*v[0] + m[5]*v[1] + m[6]*v[2] + v[3]*m[7];
    newVector[2] = m[8]*v[0] + m[9]*v[1] + m[10]*v[2] + v[3]*m[11];
    newVector[3] = m[12]*v[0] + m[13]*v[1] + m[14]*v[2] + v[3]*m[15];
    return newVector;
}

