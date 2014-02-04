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
 
 
 Known Issues:
- visual glitch between slices possible but rare
- % values as size not supported
 */


//Pie Objekt ---------------------------------------------------------------
function Pie(_id_String, _sizeStr) {
    // ID
    var _id = _id_String;
    this.id =
            function() {
                return _id;
            };
    //////////////////////////////////
    
    //size   
    var _size = (function(sizeStr){
        return parseFloat(sizeStr);
    })(_sizeStr); // return von anonymer Funktion als Wert
    var _sizeUnit = (function(sizeString){
        // trim spaces and remove the _size chars from it = unit
        var unit = sizeString.replace((""+_size),"");
        unit = String.trim(unit);
        // DEBUGG: not supporting % usage atm
        if (unit === '%'){
            alert("Pie:'" + _id + "' uses % values\n"+"These are not supported by CSSPie.js yet!\n" + "We'll use px instead for now\n" + "Please Inform your Webmaster.");
            return "px";
        }
        return unit;
    })(_sizeStr);
    this.size =
            function() {
                return _size;
            };
    this.sizeUnit =
            function(){
        return _sizeUnit;
            };
    this.sizeString =
        function () {
            return ("" + _size + _sizeUnit); 
        };
    /////////////////////////////////////////
    
    //Pie Container
    var pieContainer = document.createElement("div");
    pieContainer.id = _id;
    pieContainer.style.display = "inline-block";
    this.container =
            function() {
                return pieContainer;
            };
    this.background =
            function(_pieSizeStr, _basecolorStr) {
                pieBackground = document.createElement("div");
                pieBackground.style.width = _pieSizeStr;
                pieBackground.style.height = _pieSizeStr;
                pieBackground.style.position = "relative";
                pieBackground.style.webkitBorderRadius = _pieSizeStr;
                pieBackground.style.mozBorderRadius = _pieSizeStr;
                pieBackground.style.borderRadius = _pieSizeStr;
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
        var size = this.size();
        var unit = this.sizeUnit();
        // special clipping for 180° part (gap between two parts)
        nextSlice.style.clip = "rect(0" + unit + "," + size + unit + "," + size + unit + "," + ((size - 100) / 2) + unit + ")";
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
        var unit = this.sizeUnit();
        var sizeString = this.sizeString();
        var slice = document.createElement("div");
        slice.style.position = "absolute";
        slice.style.top = "0" + unit;
        slice.style.left = "0" + unit;
        slice.style.width = sizeString;
        slice.style.height = sizeString;
        slice.style.webkitBorderRadius = sizeString;
        slice.style.mozBorderRadius = sizeString;
        slice.style.borderRadius = sizeString;
        slice.style.clip = "rect(0" + unit + "," + sizeString + "," + sizeString + "," + ((size) / 2) + unit + ")";
        return slice;
    },
    _createSliceFill: function(_colorString) {
        var size = this.size();
        var unit = this.sizeUnit();
        var sizeString = this.sizeString();
        var pie = document.createElement("div");
        pie.style.backgroundColor = _colorString;
        pie.style.position = "absolute";
        pie.style.top = "0" + unit;
        pie.style.left = "0" + unit;
        pie.style.width = sizeString;
        pie.style.height = sizeString;
        pie.style.webkitBorderRadius = sizeString;
        pie.style.mozBorderRadius = sizeString;
        pie.style.borderRadius = sizeString;
        pie.style.clip = "rect(0" + unit + ", " + ((size) / 2) + unit + ", " + sizeString + ", 0" + unit+ ")";
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
 * @param {String} pieSizeStr - size of the pie (currently only px) TODO
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
function createPie(pieNameStr, pieSizeStr, basecolorStr, numberOfSlicesInt, percentagesIntArr, colorsStrArr) {
    var pieObject = new Pie(pieNameStr, pieSizeStr);
    var pieContainer = pieObject.container();
    var pieBackground = pieObject.background(pieSizeStr, basecolorStr);
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