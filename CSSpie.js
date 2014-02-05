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
function Pie(_id_String, _sizeStr, _basecolorStr) {
    ////////////////////// THE PIE FOUNDATION //////////////////////////////
    // ID
    var _id = _id_String;
    this.id =
            function() {
                return _id;
            };
    //////////////////////////////////

    //size   
    var _size = (function(sizeStr) {
        return parseFloat(sizeStr);
    })(_sizeStr); // return von anonymer Funktion als Wert
    var _sizeUnit = (function(sizeString) {
        // trim spaces and remove the _size chars from it = unit
        var unit = sizeString.replace(("" + _size), "");
        unit = String.trim(unit);
        // DEBUGG: not supporting % usage atm
        // pie wont show on site but appears in DOM so it seems to need a 
        // set size for the container in addition or at least a parent element on
        // the site with a set width/height to scale off of
        if (unit === '%') {
            alert("Pie:'" + _id + "' uses % values\n" + "These are not supported by CSSPie.js yet!\n" + "We'll use px instead for now\n" + "Please Inform your Webmaster.");
            return "px";
        }
        return unit;
    })(_sizeStr);
    this.size = function() {
        return _size;
    };
    this.sizeUnit = function() {
        return _sizeUnit;
    };
    this.sizeString = function() {
        return ("" + _size + _sizeUnit);
    };
    /////////////////////////////

    // pieContainer - background of the pie and container for the slices
    var pieBackground = this._createBackground(_basecolorStr);
    this.container = function() {
        return pieBackground;
    };
    //Pie Wrapper - the wrapping div of the resulting pie
    var pieWrapper = document.createElement("div");
    pieWrapper.id = _id;
    pieWrapper.style.display = "inline-block";
    pieWrapper.appendChild(pieBackground);
    this.wrapper = function() {
        return pieWrapper;
    };
    ////////////////////// ////////////////////// //////////////////////////////

    ////////////////////// Slice Management //////////////////////////////

    // Each Slice holds it own percentage
    // Pie handles references on Slices (Linked List)
    // if new slice is added, pie gets created newly!?
    var _firstSlice = null;
    this.first = function() {
        return _firstSlice;
    };
    var _lastSlice = null;
    this.last = function() {
        return _lastSlice;
    };
    var _currentSlice = null;
    this.current = function() {
        return _currentSlice;
    };
    // REVISION: linking it as list atm, should link it as circle?
    this.next = function() {
        if (!_currentSlice.equal(_lastSlice)){
            _currentSlice = _currentSlice.next;
            return _currentSlice;
        }
        else
            return _currentSlice;
    };
    this.previous = function() {
        if (!_currentSlice.equal(_firstSlice)){
            _currentSlice = _currentSlice.previous;
            return _currentSlice;}
        else
            return _currentSlice;
    };
    this.hasNext = function() {
        if (!_currentSlice.equal(this.next()))
            return true;
        else
            return false;
    };
    this.hasPrevious = function() {
        if (!_currentSlice.equal(this.previous()))
            return true;
        else
            return false;
    };
    // 
    /**
     * Adds a Slice after possibly existing Slices and moves Cursor to the new slice
     * @param {Int} _percentageInt 
     *                          value how big the slice will be in percent of the pie
     * @param {Int} _percentageStartInt value at which the slice starts (0=top mid of circle)
     * @param {String} _colorStr color of the slice as String (any legal css colorvalue)
     * @returns {Slice} the added, new currentSlice
     */
    this.addSlice = function(_percentageInt, _percentageStartInt, _colorStr) {
        var newSlice = new Slice(this, _percentageInt, _percentageStartInt, _colorStr);
        //  already existing slices
        if (_firstSlice !== null) {
            _currentSlice.next = newSlice;
            newSlice.previous = _currentSlice;
            _lastSlice = newSlice;
            _currentSlice = newSlice;
        }
        // newSLice is first Slice
        else {
            _firstSlice = newSlice;
            _currentSlice = newSlice;
            _lastSlice = newSlice;
        }
        this.container().appendChild(newSlice.html());
        return _currentSlice;
    };

    // this.getSlice(_indexOfSliceInt)
    // this.drawSlices()
    // this.dropSlices()
    // this.update()
    this.count = function() {
        if (_lastSlice !== null) {
            return _lastSlice.id();
        } else
            return 0;
    };

    // inner-Object Slice //////////
    /** Object representation of a slice of the pie
     * 
     * @param {type} _pie - the pie this slice belongs to
     * @param {Int} _percentageInt 
     *                          value how big the slice will be in percent of the pie
     * @param {Int} _percentageStartInt - value at which the slice starts (0=top mid of circle)
     * @param {String} _colorStr color of the slice as String (any legal css colorvalue)
     * @returns {Pie.Slice}
     */
    function Slice(_pie, _percentageInt, _percentageStartInt, _colorStr) {
        // TODO: handling if SLice wil be inserted between some
        // increasing id of the following slices 
        var pie = _pie;
        var _id = 1;
        if (pie.first() !== null) {
            // use id of currentSlice becauseinsertion will always be behind the currentSlice
            _id = (pie.current().id()) + 1;
        }
        this.id = function() {
            return _id;
        };
        var _percentageCovered = _percentageInt;
        var _percentageStartingAt = _percentageStartInt;
        var _color = _colorStr;
        // als linked List/Ring aufbauen?
        this.next = null;
        this.previous = null;
        var _html = pie.createSlice(_percentageCovered, _percentageStartingAt, _color);
        this.html = function() {
            return _html;
        };
        Slice.prototype = {
            equal: function(_sliceToCompareTo) {
                // TODO: more parameters for comparisson and perhaps compare() method
                var equalId = this.id() === _sliceToCompareTo.id();
                if (equalId) {
                    return true;
                }
            },
        };
    }
    ;
    /////////////////////////////////////////////////////////////////////////////////
    function Iterator(_pie) {
        // TODO
        var _currentSlice = _pie.first();
        this.first = function() {
            return _pie.first()
        };
        this.last = function() {
            return _pie.last()
        };
        this.next = function() {
                _currentSlice = _currentSlice.next;
                return _currentSlice;
        };
        this.previous = function() {
                _currentSlice = _currentSlice.previous;
                return _currentSlice.previous;
        };
    };
    this.iterator = function(){
        return new Iterator(this);
    };

}

// Klassenmethoden
Pie.prototype = {
    _createBackground: function(_basecolorStr) {
        var sizeString = this.sizeString();
        var pieBackground = document.createElement("div");
        pieBackground.style.width = sizeString;
        pieBackground.style.height = sizeString;
        pieBackground.style.position = "relative";
        pieBackground.style.webkitBorderRadius = sizeString;
        pieBackground.style.mozBorderRadius = sizeString;
        pieBackground.style.borderRadius = sizeString;
        pieBackground.style.backgroundColor = _basecolorStr;
        return pieBackground;
    },
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
     * combining them into a new div which is returned by the function
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
        pie.style.clip = "rect(0" + unit + ", " + ((size) / 2) + unit + ", " + sizeString + ", 0" + unit + ")";
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
     * Rounds up to prevent up to 1° gaps between slices
     * @param {Int} _percentageInt percentage of the circle the slice fills
     * @returns {Int} degree-value (rounded up)
     */
    percentageToDegree: function(_percentageInt) {
        return Math.round(parseFloat((_percentageInt * 180) / 50));
    },
};
////////////////////////////////////////////////////////////////////////////////
/////////////////               Library - Methods           ////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a pie with passed parameters
 * 
 * @param {String} pieNameStr - id tag of the pie
 * @param {String} pieSizeStr - size of the pie (no % support) TODO
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
    var pieObject = new Pie(pieNameStr, pieSizeStr, basecolorStr);
    ////////////////////////////////////////
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
        pieObject.addSlice(piePercentage, percentageUsed, colorsStrArr[i]);
//        var nextSlice = pieObject.createSlice(piePercentage, percentageUsed, colorsStrArr[i]);
//        pieObject.container().appendChild(nextSlice);
        percentageUsed += piePercentage;
    }
    return pieObject.wrapper();
}
/** creates a pie that is equally divided into slices
 * ColorArray gets looped over when too few colors are provided
 * 
 * accurate slicing up to 30 slices, getting messy upwards
 * TODO: increase accuracy of slices
 * 
 * @param {String} pieNameStr - id tag of the pie
 * @param {String} pieSizeStr - size of the pie (no % support) TODO
 * @param {String} basecolorStr - any legal css color-value
 *                      - "transparent" = explicit transparent background
 *                      - false-statement like null, "none" etc: no background-color attribute 
 *                      TODO: handle second case to fallback to transparent background!?
 * @param {Int} numberOfSlicesInt
 * @param {String-Array} colorsStrArr - Array of basecolorStr values (only using the first n = numberOfSlicesInt values or all values multiple times)
 * @returns {HTML} your pie wrapped in a div
 */
function createEquallyDividedPie(pieNameStr, pieSizeStr, basecolorStr, numberOfSlicesInt, colorsStrArr) {
    var pieObject = new Pie(pieNameStr, pieSizeStr, basecolorStr);
    // calculate percentage 100/numberOfSlices
    // round up = last slice smaller or perhaps not present
    // round down = gap after last one
    // dont round yet, getting rounded after degree-conversion anyways = max 0.9*n degree overlap on end, min ~0.1*n degree
    var percentPerSlice = 100 / numberOfSlicesInt;
    //Creating the Slices 
    var percentageUsed = 0;
    for (var i = 0; i < numberOfSlicesInt; i++) {
        // lets the index begin with 0 when last index got used to loop over the array
        // actual size of the array doesnt matter
        var nxtClrIndex = i % colorsStrArr.length;
        var nextColor = colorsStrArr[nxtClrIndex];
        pieObject.addSlice(percentPerSlice, percentageUsed, nextColor);
        percentageUsed += percentPerSlice;
    }
    return pieObject.wrapper();
}