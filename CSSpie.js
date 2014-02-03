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
 
 by : 	Ali Bassam
 alibassam.27@gmail.com
 
 edited by:	Jonas Krispin
 jonas.krispin@fh-duesseldorf.de
 last edited: 02.02.2014
 
 */

//NEW --- Pie Objekt ---------------------------------------------------------------
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
    pieContainer.id = this._id;
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
//	var _sliceCount_Int;
//	var _percentages_IntArr;
//	var _isSlicesEqualSized_Bool;
//	var _basecolor_String;
//	var _sliceColors_StrArr;
}

// Klassenmethoden
Pie.prototype = {
    createSliceMask: function() {
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
    createSliceFill: function(colorString) {
        var size = this.size();
        var pie = document.createElement("div");
        pie.style.backgroundColor = colorString;
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
    /* rotates passed object for passed degree value and returns rotated object.
     * object       html object to rotate
     * degreeInt    rotation value in degree
     * return       rotated html-object 
     */
    rotateSlice: function(object, degreeInt) {
        // rotate to startdegree
        object.style.webkitTransform = "rotate(" + degreeInt + "deg)";
        object.style.mozTransform = "rotate(" + degreeInt + "deg)";
        object.style.transform = "rotate(" + degreeInt + "deg)";
        return object;
    }
};
//NEW -- Pie Klasse Ende --------------------------------------------------------

function createPie(pieNameStr, pieSizePxStr, basecolorStr, percentagesIntArr, colorsStrArr) {
    var pieObject = new Pie(pieNameStr, pieSizePxStr);
    var pieContainer = pieObject.container();
    var pieBackground = pieObject.background(pieSizePxStr, basecolorStr);
    //Append Background to Container
    pieContainer.appendChild(pieBackground);
    //Loop through Slices
    var startDegree = 0;
    var degree = 0;
    var sizeNum = pieObject.size();
    // TODO
    //If only 1 percentage -> all slices that percentage
    //check coutn percentages
    //if 1 -> calculate slicecount
    // else check percentageSum
    // if percentageSum = 100 ->  sliceCount = percentages.size();
    // else if percentageSum < 100 -> sliceCount = percentages.size() +1; missingPercentage = 100 - percentageSum;
    // 
    // TODO : handle percentageSum > 100?
    var numberOfSlicesInt = percentagesIntArr.length;
    for (var i = 0; i < numberOfSlicesInt; i++) {
        //New Slice
        var newSlice = pieObject.createSliceMask();
        //New Slice Fill
        var sliceFill = pieObject.createSliceFill(colorsStrArr[i]);
        //Get Percentage
        var piePercentage = percentagesIntArr[i];
        //Check if Percentage > 50
        if (piePercentage <= 50) {
            degree = parseFloat((180 * piePercentage) / 50);
            sliceFill = pieObject.rotateSlice(sliceFill, degree);
            newSlice.appendChild(sliceFill);
            //If it's not first slice, then ...
            if (i !== 0) {
                newSlice = pieObject.rotateSlice(newSlice, startDegree);
            }
            pieBackground.appendChild(newSlice);
            startDegree += degree;
        }
        else {
            //newSlice.style.clip = "rect(0px," + (sizeNum) + "px," + (sizeNum) + "px," + ((sizeNum - 100) / 2) + "px)";
            newSlice = pieObject.rotateSlice(newSlice, startDegree);
            sliceFill = pieObject.rotateSlice(sliceFill, 180);
            newSlice.appendChild(sliceFill);
            ////
            pieBackground.appendChild(newSlice);
            ////
            var newSlice = pieObject.createSliceMask();
            if (i !== 0)
                startDegree = startDegree - 1;
            newSlice = pieObject.rotateSlice(newSlice, (180 + startDegree));
            if (i !== 0)
                startDegree = startDegree + 1;
            var sliceFill = pieObject.createSliceFill(colorsStrArr[i]);

            degree = parseFloat(((piePercentage - 50) * 180) / 50);
            if (i !== 0)
                degree = degree + 1;
            sliceFill = pieObject.rotateSlice(sliceFill, degree);
            if (i !== 0)
                degree = degree - 1;
            newSlice.appendChild(sliceFill);
            ////
            pieBackground.appendChild(newSlice);
            ///////
            startDegree += (180 + degree);
        }
    }
    return pieContainer;
}