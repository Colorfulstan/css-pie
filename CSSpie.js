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
                github.com/Colorfulstan/css-pie
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
    var _startingPercentage = 0;
    this.firstPercentage = function(){
        return _startingPercentage;
    };
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
        if (!_currentSlice.equal(_lastSlice)) {
            _currentSlice = _currentSlice.next;
            return _currentSlice;
        }
        else
            return _currentSlice;
    };
    this.previous = function() {
        if (!_currentSlice.equal(_firstSlice)) {
            _currentSlice = _currentSlice.previous;
            return _currentSlice;
        }
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
    
    /**
     * Removes a slice from the pie and updates its html.
     * @param {type} _sliceIdToRemove
     * @returns {undefined}
     */
    this.removeSlice = function(_sliceIdToRemove){
        // find Slice
        var needle = this.getSliceById(_sliceIdToRemove);
        // If Slice was found
        if (needle !== null){
            needle._removeFromLinks();
            if (needle.equal(_firstSlice)){
                _firstSlice = needle.next;
            }
            if (needle.equal(_lastSlice)){
                _lastSlice = needle.previous;
            }
            if (needle.equal(_currentSlice)){
                _currentSlice = null;
            }
            this.update();
        }
    };

    this.getSliceById = function(_indexOfSliceInt) {
        return this.first()._findId(_indexOfSliceInt);
    };
    this.drawSlices = function(){
        var it = this.iterator();
        var current = it.first();
        while(current !== null){
            this.container().appendChild(current.html());
            current = it.next();
        }
    };
     this.dropSlices= function(){
         while (this.container().hasChildNodes()){
             this.container().removeChild(this.container().firstChild);
         }
     };
    // WIP /////////////////////////
    this.update = function() {
        var it = this.iterator();
        var current = it.first();
        // removing HTML of al slices
        this.dropSlices();
        while (current !== null) {
            // update following ids if the current and following id are not correct
            // (counting up 1 per slice)
            
            // if current Slice is first set its id to 1
            // and make sure its percentages are set right
            if (current.equal(it.first())) {
                    current.newId(1);
                    current.setPercentages(this.firstPercentage(),current.percentageSize());
                }
            // if ids dont match the order
            if (current.hasNext() && current.id() !== (current.next.id() - 1)) {
                // start from that with updating the following ids
                current._updateFollowingIds();
            }
            current = it.next();
        }
        // and update following percentages
        it.first()._updateFollowingPercentages();
        // adding html of Slices
        this.drawSlices();
    };
    this.count = function() {
        if (_lastSlice !== null) {
            return _lastSlice.id();
        } else
            return 0;
    };
    /**
     * Method moves the slice by given values for top/left 
     * @param {Int} _sliceId - Id of the Slice to be moved
     * @param {Float} _topNum - Value to move the Slice by
     * @param {Float} _leftNum - Value to move the Slice by
     * @returns {undefined}
     */
    this.moveSlice = function(_sliceId,_topNum,_leftNum){
        var slice = this.getSliceById(_sliceId);
        slice._moveSlice(_topNum,_leftNum);
//        slice.style.zIndex = 1;
        this.update();
    };
//    this.offsetSlice= function(_slice,_valueInt){
//        _slice._offset(_valueInt);
//        this.update();
//    };

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
        this.newId = function(idInt) {
            _id = idInt;
        };
        var _offsetX = 0;
        var _offsetY = 0;
//        this.isOffset = function(){
//            return (_offsetX === 0 && _offsetY === 0);
//        };
        var _percentageCovered = _percentageInt;
        this.percentageSize = function(){
            return _percentageCovered;
        };
        var _percentageStartingAt = _percentageStartInt;
        this.percentageStart = function(){
            return _percentageStartingAt;
        };
        var _percentageEndingAt = _percentageStartingAt + _percentageCovered;
        this.percentageEnd = function(){
            return _percentageEndingAt;
        };
        this.setPercentages = function(_start, _covered){
            _percentageCovered = _covered;
            _percentageStartingAt = _start;
            _percentageEndingAt = _start + _covered;
        };
        var _color = _colorStr;
        // als linked List/Ring aufbauen?
        this.next = null;
        this.hasNext = function() {
            return (this.next !== null);
        };
        this.previous = null;
        this.hasPrevious = function() {
            return (this.previous !== null);
        };
        /**
         * Methods returns HTML-Code of the Slice by creating it with attributes
         * saved in calling Slice
         * @returns {HTML} - HTML-Element - HTML-Code of the slice
         */
        this.html = function() {
            return pie.createSlice(_percentageCovered, _percentageStartingAt, _color, _offsetX, _offsetY);
        };
        /**
         * 
         * @type type
         */
        /**
         * Method offsets the slice by given values for top/right
         * @param {Float} _topNum - Value to move the Slice by
         * @param {Float} _leftNum - Value to move the Slice by
         */
        this._moveSlice = function(_topNum,_leftNum){
            _offsetX += _leftNum;
            _offsetY += _topNum;
        };
        // WIP TODO
//        this._offset = function(_offsetToMiddleInt){
//            var percentageMid = (this.percentageStart() + this.percentageEnd()) / 2;
//            if (percentageMid % 100 === 0){
//                percentageMid /= 100;
//            } else {
//                percentageMid = percentageMid % 100;
//            }
//            alert("percentageMid = " + percentageMid); // DEBUG INFO
//                alert(this.percentageStart());
//                alert(this.percentageEnd());
//            
//            if (percentageMid < 25){
//                // first quadrant
//
//                var vectorX = 0;
//                var vectorY = 0;
//                
//                // calculating vector through triangle
//                var degree = pie.percentageToDegree(percentageMid);
//                degree = 90 - degree; // 90 = x-axis | angle between x-axis and mid of degrees from slice
//                alert("degree in 1. quadrant= " + degree); // DEBUG INFO 
//                
//                var hypo = (pie.size()/2); // Point on circle / mid if degrees from slice / searched vector
//                var cos = Math.abs(Math.cos(degree));
//                var sin = Math.abs(Math.sin(degree));
//                
//                // cos = ankathete / Hypothenuse
//                // ankathete = Hypo * cos
//                vectorX = hypo * cos;
//                
//                // sin = gegenkathete / Hypotenuse
//                // gegenkathete = Hypo * sin
//                vectorY = hypo * sin;
//                
//                // geradengleichung für Offset
////                var m = vectorY / vectorX;
////                var b = _offsetY;
//                // y = mx + b
//                // mx = y - b
//                // x = (y-b) / m
//                // 
//                var vectorMoveX = (_offsetToMiddleInt * cos);
//                var vectorMoveY = -(_offsetToMiddleInt * sin)/2;
//                
//                alert("vx= " + vectorX);
//                alert("vy= " + vectorY);
//                alert("offsetX= " + vectorMoveX);
//                alert("offsetY= " + vectorMoveY);
////                alert("new top= currentTop + " + (_offsetToMiddleInt * vectorY));
////                alert("new left= currentLeft + " + (_offsetToMiddleInt * vectorX));
////                if (degree > 45){
////                    _offsetY -= (vectorY);
////                    _offsetX -= (vectorX);
////                } else {
//                _offsetX += (vectorMoveX);
//                _offsetY += (vectorMoveY);
////                }
//            } else if (percentageMid < 50){
//                // second quadrant
////                var degree = pie.percentageToDegree(percentageMid);
////                degree = degree - 90;
////                alert("degree of movingVector= " + degree);
////                
////                var vectorX = 0;
////                var vectorY = 0;
////                vectorX = Math.sin(-degree);
////                vectorY = -Math.cos(degree)*(pie.size()/2);
////                alert("vx= " + vectorX);
////                alert("vy= " + vectorY);
////                alert("new top= currentTop + " + (_offsetToMiddleInt * vectorY));
////                alert("new left= currentLeft + " + (_offsetToMiddleInt * vectorX));
////                _offsetY += (vectorY * _offsetToMiddleInt);
////                _offsetX += (vectorX * _offsetToMiddleInt);
//                
//            } else if (percentageMid < 75){
//                    // third quadrant
////                    var degree = pie.percentageToDegree(percentageMid);
//////                    degree = 270 - degree;
////                    alert("degree of movingVector= " + degree);
////                
////                var vectorX = 0;
////                var vectorY = 0;
////                vectorX = Math.sin(-degree);
////                vectorY = Math.cos(degree)*(pie.size());
////                alert("vx= " + vectorX);
////                alert("vy= " + vectorY);
////                alert("new top= currentTop + " + (_offsetToMiddleInt * vectorY));
////                alert("new left= currentLeft + " + (_offsetToMiddleInt * vectorX));
////                _offsetY += (vectorY * _offsetToMiddleInt);
////                _offsetX += (vectorX * _offsetToMiddleInt);
//            } else {
//                    // fourth quadrant
//                
//            }
//            // Vektor 1 bestimmen (startDegree)
//            // Vektor 2 bestimmen (endDegree)
//            // P1 + P2 berechnen
//            // G1/2 ? P3
//            // Vektor 3 bestimmen (0 + r*P3)
//            // r = _offsetToMiddleInt
//            // top / left + result of x/y
////            this.moveBy(x,y);
//        };
    };
    Slice.prototype = {
        /**
         * Checks if the calling Slice equals the passed Slice
         * @param {Slice} _sliceToCompareTo
         * @returns {Boolean}
         */
        equal: function(_sliceToCompareTo) {
            // TODO: more parameters for comparisson and perhaps compare() method
            var equalId = this.id() === _sliceToCompareTo.id();
            if (equalId) {
                return true;
            }
        },
        /**
         * Sets the ids of the SLices in Order which follows to the calling Slice
         * 
         */
        _updateFollowingIds: function() {
            var next = this.next;
            if (next !== null) {
                next.newId((this.id()) + 1);
                next._updateFollowingIds();
            }
//                alert("currently processing: " + this.id()); // DEBUGG INFO
            return;
        },
        _updateFollowingPercentages: function(){
            var next = this.next;
            if(next !== null){
//            alert(this.percentageEnd() + " " + next.percentageStart());
                next.setPercentages(this.percentageEnd(),next.percentageSize());
//            alert(this.percentageEnd() + " " + next.percentageStart());
                next._updateFollowingPercentages();
            }
            else {
                return;
            }
        },
        /**
         * Cycles through all Slices to find the passed Slice
         * @param {type} _sliceToFind
         * @returns {Boolean} - returns true if Slice is found
         */
        _isSliceInPie: function(_sliceToFind) {
            if (this.equal(_sliceToFind)) {
                return true;
            }
            var next = this.next;
            if (next !== null) {
                return next.isSliceInPie(_sliceToFind);
            }
//                alert("currently processing: " + this.id()); // DEBUGG INFO
            return false;
        },
        /**
         * Cycles through all Slices to find the Slice with passed id
         * @param {type} _idToFindInt
         * @returns {Pie.Slice.prototype} - returns Slice if found or null if not in Pie
         */
        _findId: function(_idToFindInt) {
            if (this.id() === _idToFindInt) {
//                alert("found " + this.id());
                return this;
            } else if (this.next !== null) {
                return this.next._findId(_idToFindInt);
            }
            return null;
        },
                /**
                 * Redirects the references from surrounding Slices to remove
                 * the calling Slice from the links
                 * @returns {Pie.Slice.prototype} the removed Slice
                 */
        _removeFromLinks: function(){
            var previous = this.previous;
            var next = this.next;
            if (previous!== null){
                previous.next = next;
            }
            if (next !== null){
                next.previous = previous;
            }
            return this;
        }
    };
    ;
    /////////////////////////////////////////////////////////////////////////////////
    function Iterator(_pie) {
        var _currentSlice = _pie.first();
        this.first = function() {
            return _pie.first();
        };
        this.last = function() {
            return _pie.last();
        };
        this.next = function() {
            _currentSlice = _currentSlice.next;
            return _currentSlice;
        };
        this.previous = function() {
            _currentSlice = _currentSlice.previous;
            return _currentSlice.previous;
        };
    }
    ;
    this.iterator = function() {
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
    createSlice: function(_percentageInt, _percentageStartInt, _colorString, _offsetX, _offsetY) {
        if (_percentageInt <= 50) {
            var sliceHtml = this._createSlimSlice(_percentageInt, _percentageStartInt, _colorString);
        }
        else {
            var sliceHtml = this._createBigSlice(_percentageInt, _percentageStartInt, _colorString);
        }
        sliceHtml.style.top = _offsetY + "" + this.sizeUnit();
        sliceHtml.style.left = _offsetX + "" + this.sizeUnit();
        if (parseInt(_offsetX) !== 0 || parseInt(_offsetY) !== 0){
            sliceHtml.style.zIndex += 1;
        }
        return sliceHtml;
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
        var sliceHtml = this._createSliceMask();
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
        sliceHtml.appendChild(sliceFill);
        sliceHtml = this.rotateSlice(sliceHtml, startDegree);
//            }
        return sliceHtml;
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
    _createBigSlice: function(_percentageInt, _percentageStartInt, _colorString, _offsetX, _offsetY) {
        var sliceContainer = document.createElement("div");
        var nextSlice = this._createSlimSlice(50, _percentageStartInt, _colorString, _offsetX, _offsetY);
        var size = this.size();
        var unit = this.sizeUnit();
        // special clipping for 180° part (gap between two parts)
        nextSlice.style.clip = "rect(0" + unit + "," + size + unit + "," + size + unit + "," + ((size - 100) / 2) + unit + ")";
        sliceContainer.appendChild(nextSlice);
        _percentageInt -= 50;
        _percentageStartInt += 50;
        //remaining part
        var nextSlice = this._createSlimSlice(_percentageInt, _percentageStartInt, _colorString, _offsetX, _offsetY);
        sliceContainer.appendChild(nextSlice);
        return sliceContainer;
    },
    _createSliceMask: function() {
        var size = this.size();
        var unit = this.sizeUnit();
        var sizeString = this.sizeString();
        var sliceHtml = document.createElement("div");
        sliceHtml.style.position = "absolute";
        sliceHtml.style.top = "0" + unit;
        sliceHtml.style.left = "0" +  unit;
        sliceHtml.style.width = sizeString;
        sliceHtml.style.height = sizeString;
        sliceHtml.style.webkitBorderRadius = sizeString;
        sliceHtml.style.mozBorderRadius = sizeString;
        sliceHtml.style.borderRadius = sizeString;
        sliceHtml.style.clip = "rect(0" + unit + "," + sizeString + "," + sizeString + "," + ((size) / 2) + unit + ")";
        return sliceHtml;
    },
    _createSliceFill: function(_colorString) {
        var size = this.size();
        var unit = this.sizeUnit();
        var sizeString = this.sizeString();
        var fillHtml = document.createElement("div");
        fillHtml.style.backgroundColor = _colorString;
        fillHtml.style.position = "absolute";
        fillHtml.style.top = "0" + unit;
        fillHtml.style.left = "0" + unit;
        fillHtml.style.width = sizeString;
        fillHtml.style.height = sizeString;
        fillHtml.style.webkitBorderRadius = sizeString;
        fillHtml.style.mozBorderRadius = sizeString;
        fillHtml.style.borderRadius = sizeString;
        fillHtml.style.clip = "rect(0" + unit + ", " + ((size) / 2) + unit + ", " + sizeString + ", 0" + unit + ")";
        return fillHtml;
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

function createPieObject(pieNameStr, pieSizeStr, basecolorStr, numberOfSlicesInt, percentagesIntArr, colorsStrArr){
    
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
    var percentageUsed = pieObject.firstPercentage();
    for (var i = 0; i < numberOfSlicesInt; i++) {
        var piePercentage = percentagesIntArr[i];
        pieObject.addSlice(piePercentage, percentageUsed, colorsStrArr[i]);
//        var nextSlice = pieObject.createSlice(piePercentage, percentageUsed, colorsStrArr[i]);
//        pieObject.container().appendChild(nextSlice);
        percentageUsed += piePercentage;
    }
    return pieObject;
}

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
    var pieContainer = createPieObject(pieNameStr, pieSizeStr, basecolorStr, numberOfSlicesInt, percentagesIntArr, colorsStrArr);
    return pieContainer.wrapper();
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
    var percentageUsed = pieObject.firstPercentage();
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