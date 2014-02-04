/*
 -------------------------------------------------
 CSS3 Pie Chart Generator
 ------------------------------------------------
 
 A JavaScript Library that allows you to create a dynamic CSS3 Pie Chart anywhere on your webpage. Purely CSS.
 
 
 How to Pie:
 mistercss.blogspot.com/2013/04/pie-chart-javascript-library.html
 code.google.com/p/css-pie/wiki/HowToPie
 
 Download from:
 code.google.com/p/css-pie/downloads/list
 github.com/AliBassam/css-pie
 
 by :	Ali Bassam
 alibassam.27@gmail.com
 
 edited by:	Jonas Krispin - Object Orientation
 jonas.krispin@fh-duesseldorf.de

Usage of the Pie:
- create Pie-Object with neccessarry Parameters
- let this object create its slices etc.
 
 */


//Pie Objekt ---------------------------------------------------------------
function Pie(_id_String, _sizePxStr) {
    var _id = _id_String;
    this.id =
            function() {
                return _id;
            };
    var _size_Num = parseFloat(_sizePxStr.replace("px", ""));
    this.size =
            function() {
                return _size_Num;
            };
    //Pie Container
    var pieContainer = document.createElement("div");
    pieContainer.id = _id;
    pieContainer.style.display = "inline-block";
    this.container =
            function() {
                return pieContainer;
            };
    this.background =
            function(_pieSizePxStr, _basecolorStr) {
                pieBackground = document.createElement("div");
                pieBackground.style.width = _pieSizePxStr;
                pieBackground.style.height = _pieSizePxStr;
                pieBackground.style.position = "relative";
                pieBackground.style.webkitBorderRadius = _pieSizePxStr;
                pieBackground.style.mozBorderRadius = _pieSizePxStr;
                pieBackground.style.borderRadius = _pieSizePxStr;
                pieBackground.style.backgroundColor = _basecolorStr;
                return pieBackground;
            };
}

// Klassenmethoden
Pie.prototype = {
    /**
     * takes degree-values and color to create a slice of the calling pieObject
     * 
     * @param {Int} _percentageInt 
     *                          value how big the slice will be in percent of the pie
     * @param {Int} _percentageStartInt value at which the slice starts (0=top mid of circle)
     * @param {String} _colorString color of the slice as String (any legal css colorvalue)
     * @returns {"div"} Slice of the pie
     */
    createSlice: function(_percentageInt, _percentageStartInt, _colorString) {
        if (_percentageInt <= 50) {
            return this._createSlimSlice(_percentageInt, _percentageStartInt, _colorString);
        }
        else {
            return this._createBigSlice(_percentageInt, _percentageStartInt, _colorString);
        }
    },
    /**
     * creates Slice of up to 50% value
     * @param {Int} _percentageInt - percentage value the slice contains
     * @param {Int} _percentageStartInt - percentage value to start the slice at
     * @param {String} _colorString color of the slice as String (any legal css colorvalue)
     * @returns {"div"} Container with the big Slice
     */
    _createSlimSlice: function(_percentageInt, _percentageStartInt, _colorString) {
        var degree = this.percentageToDegree(_percentageInt);
        var startDegree = this.percentageToDegree(_percentageStartInt);
        //New Slice
        var slice = this._createSliceMask();
        // if this isnt the first slice and not the second part of a bigSlice
        if (startDegree !== 0 && startDegree !== 180) {
            // Size of slice +2
            degree += 2;
            // Start of Slice -2
            startDegree -= 2;
            // fixes visual glitches somewhat
            // TODO: better method for fixing visual glitch between pie-slices
        }

        //New Slice Fill
        var sliceFill = this._createSliceFill(_colorString);
        sliceFill = this.rotateSlice(sliceFill, degree);
        slice.appendChild(sliceFill);
        slice = this.rotateSlice(slice, startDegree);
//            }
        return slice;
    },
    /**
     * creates Slice of values over 50% by dividing it into two parts and 
     * combining them into a new div which is returned to the caller
     * 
     * @param {Int} _percentageInt - percentage value the slice contains
     * @param {Int} _percentageStartInt - percentage value to start the slice at
     * @param {String} _colorString color of the slice as String (any legal css colorvalue)
     * @returns {"div"} Container with the big Slice
     */
    _createBigSlice: function(_percentageInt, _percentageStartInt, _colorString) {
        var sliceContainer = document.createElement("div");
        var nextSlice = this._createSlimSlice(50, _percentageStartInt, _colorString);
        // special clipping for 180° part (gap between two parts)
        var size = this.size();
        nextSlice.style.clip = "rect(0px," + (size) + "px," + (size) + "px," + ((size - 100) / 2) + "px)";
        sliceContainer.appendChild(nextSlice);
        _percentageInt -= 50;
        _percentageStartInt += 50;
        //remaining part
        var nextSlice = this._createSlimSlice(_percentageInt, _percentageStartInt, _colorString);
        sliceContainer.appendChild(nextSlice);
        return sliceContainer;
    },
    _createSliceMask: function() {
        var size = this.size();
        var slice = document.createElement("div");
        slice.style.position = "absolute";
        slice.style.top = "0px";
        slice.style.left = "0px";
        slice.style.width = size + "px";
        slice.style.height = size + "px";
        slice.style.webkitBorderRadius = size + "px";
        slice.style.mozBorderRadius = size + "px";
        slice.style.borderRadius = size + "px";
        slice.style.clip = "rect(0px," + size + "px," + size + "px," + ((size) / 2) + "px)";
        return slice;
    },
    _createSliceFill: function(_colorString) {
        var size = this.size();
        var pie = document.createElement("div");
        pie.style.backgroundColor = _colorString;
        pie.style.position = "absolute";
        pie.style.top = "0px";
        pie.style.left = "0px";
        pie.style.width = size + "px";
        pie.style.height = size + "px";
        pie.style.webkitBorderRadius = size + "px";
        pie.style.mozBorderRadius = size + "px";
        pie.style.borderRadius = size + "px";
        pie.style.clip = "rect(0px, " + ((size) / 2) + "px, " + size + "px, 0px)";
        return pie;
    },
     /** rotates passed object for passed degree value and returns rotated object.
      * 
      * @param {HTML-Object} _object    html object to rotate
      * @param {Int} _degreeInt         rotation value in degree
      * @returns {HTML-Object}          rotated html-object 
      */
    rotateSlice: function(_object, _degreeInt) {
        // rotate to startdegree
        _object.style.webkitTransform = "rotate(" + _degreeInt + "deg)";
        _object.style.mozTransform = "rotate(" + _degreeInt + "deg)";
        _object.style.transform = "rotate(" + _degreeInt + "deg)";
        return _object;
    },
    /**
     * Converts Percentage Value of a slice to a degree-value of the circle
     * Rounds up
     * @param {Int} percentage of the circle the slice fills
     * @returns {Int} degree-value (rounded up)
     */
    percentageToDegree: function(_percentageInt) {
        return Math.round(parseFloat((_percentageInt * 180) / 50));
    },
};
// Pie Klasse Ende --------------------------------------------------------

/**
 * Creates a pie with passed parameters
 * 
 * @param {String} pieNameStr - id tag of the pie
 * @param {String} pieSizePxStr - size of the pie (currently only px) TODO
 * @param {String} basecolorStr - any legal css color-value
 *                      - "transparent" = explicit transparent background
 *                      - false-statement like null, "none" etc: no background-color attribute 
 *                      TODO: handle second case to fallback to transparent background!?
 * @param {Int} numberOfSlicesInt - how many slices you need drawn?
 * @param {Int-Array} percentagesIntArr 
 *                      - the percentage-values of the slices (only using the first n = numberOfSlicesInt values)
 * @param {String-Array} colorsStrArr - Array of basecolorStr values (only using the first n = numberOfSlicesInt values)
 * @returns {"div"} - your pie as HTML-code with inline-styling 
 *              TODO: replace inline-styling with stylesheet / classes
 */
function createPie(pieNameStr, pieSizePxStr, basecolorStr, numberOfSlicesInt, percentagesIntArr, colorsStrArr) {
    var pieObject = new Pie(pieNameStr, pieSizePxStr);
    var pieContainer = pieObject.container();
    var pieBackground = pieObject.background(pieSizePxStr, basecolorStr);
    //Append Background to Container
    pieContainer.appendChild(pieBackground);
    // TODO
    //If only 1 percentage -> all slices that percentage
    //check coutn percentages
    //if 1 -> calculate slicecount
    // else check percentageSum
    // if percentageSum = 100 ->  sliceCount = percentages.size();
    // else if percentageSum < 100 -> sliceCount = percentages.size() +1; missingPercentage = 100 - percentageSum;
    // 
    // TODO : handle percentageSum > 100?
    //var numberOfSlicesInt = percentagesIntArr.length;
    
    //Creating the Slices 
    var percentageUsed = 0;
    for (var i = 0; i < numberOfSlicesInt; i++) {
        var piePercentage = percentagesIntArr[i];
            var nextSlice = pieObject.createSlice(piePercentage, percentageUsed, colorsStrArr[i]);
            pieBackground.appendChild(nextSlice);
            percentageUsed += piePercentage;
    }
    return pieContainer;
}