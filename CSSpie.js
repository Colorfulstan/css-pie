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
 
 
 
 Known Issues:
 - visual glitch between slices possible but rare
 - % values as size not supported
 */

/**
 * Pie Object contains of a background-circle and its slices. At Object-creation, a 
 * background with given color and of given size and unit is created. The pie
 * has the given id which equals the html-tag "id" in the produced html code.
 * The Object offers methods for creating, deleting and manipulating Slices
 * and delivering the pie as pure HTML/CSS Element.
 * 
 * The Pie Object is designed as Linked-List of Slices so it allows to navigate 
 * through the Slices via the traditional Linked-List Methods. It also allows to
 * create an Iterator through .iterator() to navigate over an independent set of 
 * cursors.
 * 
 * See <TODO: insert URL> for details on the methods.
 * @param {type} _idStr
 *                              String which will be used as "id" tag for the HTML-wrapper-div of the pie
 * @param {type} _sizeStr
 *                              Size of the Pie as String with unit.
 *                              % as unit is currently not supported.
 *                              TODO: integrate % support
 * @param {type} _basecolorStr
 *                              Any legal CSS Color as String for the background-color of the pie-circle
 * @returns {Pie}
 */
function Pie(_idStr, _sizeStr, _basecolorStr) { // Pie START ///////////////
    /////////////////////////////////////////////////////////////////
    ////////////////////// Constructor //////////////////////////////
    /////////////////////////////////////////////////////////////////
    // ID //////////////////////////////////
    var _id = _idStr;
    this.id = function() { return _id; };
    // size ////////////////////////////////
//    var _size = (function(sizeStr) { return parseFloat(sizeStr);})(_sizeStr); // return of anonymous function as value
    var _size = parseFloat(_sizeStr);
    var _sizeUnit = (function(sizeString) { // function START //////////////////
        // trim spaces and remove the _size chars from it = unit
        var unit = sizeString.replace(("" + _size), "");
        unit = unit.trim();
        // DEBUGG: not supporting % usage atm
        // pie wont show on site but appears in DOM so it seems to need a 
        // set size for the container in addition or at least a parent element on
        // the site with a set width/height to scale off of
        if (unit === '%') {
            alert("Pie:'" + _id + 
                    "' uses % values\n" + 
                    "These are not supported by CSSPie.js yet!\n" + 
                    "We'll use px instead for now\n" + 
                    "Please Inform your Webmaster.");
            return "px";
        }
        return unit;
    })(_sizeStr); // return of anonymous function as value
        // function END //////////////////////////////////////////////
    this.size = function() { return _size; };
    this.sizeUnit = function() { return _sizeUnit; };
    this.sizeString = function() { return ( "" + _size + _sizeUnit); };
    // pieContainer - background of the pie and container for the slices ///////
	// TODO: setBackground() for piecontainer
    var pieBackground = this._createBackground(_basecolorStr);
    this.container = function() { return pieBackground; };
    //Pie HTML - the wrapping div of the resulting pie therefore the HTML of the pie
    var pieHTML = document.createElement("div");
    pieHTML.id = _id;
    pieHTML.style.display = "inline-block";
    pieHTML.appendChild(pieBackground);
    /**
     * Method returns the HTML-code to be appended to the body or other elements on the site
     * @returns {HTML} 
     *                  HTML-Element of the pie
     */
    this.html = function() { return pieHTML; };
    /////////////////////////////////////////////////////////////////
    ////////////////////// End Constructor //////////////////////////
    /////////////////////////////////////////////////////////////////
    //-------------------------------------------------------------//
    /////////////////////////////////////////////////////////////////
    ////////////////////// Slice Management //////////////////////////
    /////////////////////////////////////////////////////////////////
    var _startingPercentage = 0;
    this.firstPercentage = function(){ return _startingPercentage; };
    this.setNewStart = function(_newStartingPercentage){
        _startingPercentage = _newStartingPercentage;
        this.update();
    };
    var _firstSlice = null;
    this.first = function() { return _firstSlice; };
    var _lastSlice = null;
    this.last = function() { return _lastSlice; };
    var _currentSlice = null;
    this.current = function() { return _currentSlice; };
    // Navigation //////////////////////////////////////////////////
    /**
     * Method returns the next Slice to the current one or it returns the 
     * current Slice if its the last Slice. 
     * Sets the cursor of the Pie for currentSlice on the Slice returned.
     * @returns {Slice}
     *                  next Slice or currentSlice if thats the last one
     */
    this.next = function() {
        if (!_currentSlice.equals(_lastSlice)) {
            _currentSlice = _currentSlice.next;
            return _currentSlice;
        }
        else {return _currentSlice;}
    };
    /**
     * Method returns the previous Slice to the current one or it returns the 
     * current Slice if its the first Slice. 
     * Sets the cursor of the Pie for currentSlice on the Slice returned.
     * @returns {Slice}
     *                  next Slice or currentSlice if thats the last one
     */
    this.previous = function() {
        if (!_currentSlice.equals(_firstSlice)) {
            _currentSlice = _currentSlice.previous;
            return _currentSlice;
        }
        else
            return _currentSlice;
    };
    this.hasNext = function() {
        if (!_currentSlice.equals(this.next())) {return true; }
        else {return false;}
    };
    this.hasPrevious = function() {
        if (!_currentSlice.equals(this.previous())){ return true; }
        else { return false; }
    }; 
    /////////////////////////////////////////////////////////////////
    /**
     * Adds a Slice after possibly existing Slices and moves Cursor to the new slice
     * @param {Int} _percentageInt 
     *                          value how big the slice will be in percent of the pie
     * @param {Int} _percentageStartInt 
     *                                      value at which the slice starts (0=top mid of circle)
     *                                      Only relevant if you dont create Pie.update()
     *                                      Or a single Slice
     * @param {String} _backgroundStr String with background (any legal css colorvalue or url(...) to image)
     * @returns {Slice} the added, new currentSlice
     */
    this.addSlice = function(_percentageInt, _percentageStartInt, _backgroundStr) {
        var newSlice = new Slice(this, _percentageInt, _percentageStartInt, _backgroundStr);
        //  already existing slices
        if (_firstSlice !== null) {
            _currentSlice.next = newSlice;
            newSlice.previous = _currentSlice;
            _lastSlice = newSlice;
            _currentSlice = newSlice;
        }
        // newSLice is first Slice
        else {
            _startingPercentage = newSlice.percentageStart();
            _firstSlice = newSlice;
            _currentSlice = newSlice;
            _lastSlice = newSlice;
        }
//        this.container().appendChild(newSlice.html());
        this.update();
        
        return _currentSlice;
    };
    /**
     * Removes a slice from the pie and updates its html.
     * Remaining Slices will adapt there position on the pie to fill the gap.
     * if the removed Slice is the currentSlice of the pie, that Cursor will
     * be set onto the firstSlice
     * 
     * @param {type} _sliceIdToRemove
     *                                  Id of the Slice to remove
     * @return {Boolean} true if a Slice got removed
     */
    this.removeSlice = function(_sliceIdToRemove){
        // find Slice
        var needle = this.getSliceById(_sliceIdToRemove);
        // If Slice was found
        if (needle !== null){
            needle._removeFromLinks();
            if (needle.equals(_firstSlice)){
                _firstSlice = needle.next;
            }
            if (needle.equals(_lastSlice)){
                _lastSlice = needle.previous;
            }
            if (needle.equals(_currentSlice)){
                _currentSlice = _firstSlice;
            }
            this.update();
            return true;
        }
        return false;
    };
    /**
     * searches for the slice with given id and returns it if found.
     * @param {type} _indexOfSliceInt
     * @returns {Slice} - Slice with the given id or null if not found
     */
    this.getSliceById = function(_indexOfSliceInt) {
        return this.first()._findSlice(_indexOfSliceInt);
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
        this.update();
    };
    /**
     * Method moves the slice away from the middle by the given value
     * movingVector = anglehalfing of startdegree + enddegree
     * @param {type} _sliceIdInt - Id of the slice to move
     * @param {type} _valueInt - value to move it away from the middle
     * @returns {undefined}
     */
    this.offsetSlice= function(_sliceIdInt,_valueInt){
        var slice = this.getSliceById(_sliceIdInt);
        slice._offset(_valueInt);
        this.update();
    };
    /**
     * Appends the HTML off all the Slices to this.container()
     */
    this._drawSlices = function(){
        var it = this.iterator();
        var current = it.first();
        while(current !== null){
            this.container().appendChild(current.html());
            current = it.next();
        }
    };
    /**
     * Removes all Slices from container
     */
    this.dropSlices= function(){
        while (this.container().hasChildNodes()){
            this.container().removeChild(this.container().firstChild);
        }
    };
    /////////////////////////////////////////////////////////////////
    ////////////////////// Slicegroups //////////////////////////////
    /////////////////////////////////////////////////////////////////
    // TODO: Slices should contain their group? REVISION
    this.slicegroups = [];
    /**
     * Checks if the given number of a slicegroup is valid.
     * 
     * Conditions:
     * - Number < 0 
     * - Number > number of slicegroups
     * 
     * @param {type} _slicegroupInt
     *                              number of the slice group to check
     * @returns {Boolean}
     *                              true if the slicegroup exists
     */
    this.isSlicegroupIdValid = function(_slicegroupInt){
       if (_slicegroupInt <= 0){
           alert("slicegroupId is <= 0 and invalid"); // DEBUGG Info
           return false;
       }
       if (_slicegroupInt > this.slicegroups.length){
           alert("slicegroups.length <= _slicegroupIdInt - slicegroup Number " + _slicegroupInt + "doesnt exist"); // DEBUGG Info
           return false;
       }
       else {
           return true;
       }
    };
    /**
     * Groups Slices together and returns an Slicegroup Object.
     * @param {type} _fromSliceIdInt 
     *                                  first Slice (lowest id) to include in the group
     * @param {type} _toSliceIdInt 
     *                                  last Slice (highest id) to include in the group
     * @returns {Slicegroup} 
     *                                  the created Slicegroup Object
     */
    this.groupSlices = function(_fromSliceIdInt, _toSliceIdInt){
        var sliceArray = [];
        // loop 
        for (var i = _fromSliceIdInt; i <= _toSliceIdInt; i++){
           // findSlice
           sliceArray.push(this.getSliceById(i));// put in array
        } // end loop
        var slicegroup = new Slicegroup(this,sliceArray); // create SLciegroup from array
        this.slicegroups.push(slicegroup);// push into slicegroups Array
        // return id of Slicegroup
        console.log("Slicegroup " + slicegroup.id() + " created"); // DEBUG INFO
       return slicegroup;
    };
    /**
     * Finds the Slicegroup that contains the Slice with the given id
     * and ungroups it elements by removing the group-reference from 
     * the Slicegroups Array
     * 
     * @param {type} _sliceIdInGroupInt
     *                                  Id of a Slice in the group that should be deleted
     */
    this.ungroupSlicegroupContaining = function(_sliceIdInGroupInt){
         // find group and its index
         for (var i=0;i<this.slicegroups.length;i++){
             var currentSG = this.slicegroups[i];
             if (currentSG.isSliceInGroup(_sliceIdInGroupInt)){
                // remove it from _slicegroups
                 this.slicegroups.splice(i,1);
                 console.log("Slicegroup " + i + " containing Slice " +_sliceIdInGroupInt+" removed"); // DEBUG INFO
             }
         }
     };
    /**
     * 
     * Ungroups the elements of the n-th Slicegroup, where n = the given value.
     * It does that by removing the group-reference from the Slicegroups Array
     * @param {type} _slicegroupInt
     *                              Slicegroup to delete (n-th)
     */
    this.ungroupSlicegroup = function(_slicegroupInt){
        // TODO id handling! <= arrayindex
         if (this.isSlicegroupIdValid(_slicegroupInt)){
             var index = _slicegroupInt -  1;
                // remove it from _slicegroups
                 this.slicegroups.splice(index,1);
                 console.log("Slicegroup " + _slicegroupInt + " removed"); // DEBUG INFO
         }
     };
    /**
     * Moves the n-th Slicegroup by the given values and updates the pie.
     * @param {type} _slicegroupInt
     *                              Slicegroup to move (n-th)
     * @param {Float} _offsetX
     *                              "left"-value to add
     * @param {Float} _offsetY
     *                              "top"-value to add
     */
    this.moveSlicegroup = function(_slicegroupInt, _offsetX, _offsetY){
        if (this.isSlicegroupIdValid(_slicegroupInt)){
            var slicegroup = this.slicegroups[_slicegroupInt-1];
            slicegroup.moveSlicegroup(_offsetX, _offsetY);
            this.update();
        }
     };
    /**
     * Moves the n-th Slicegroup by the given value away from the center of the pie.
     * Moving Vector is half angle between starting Angle of the first and 
     * Ending Angle of the last Slice within the group.
     * Updates the pie.
     * @param {type} _slicegroupInt
     *                              Slicegroup to move (n-th)
     * @param {Float} _offsetX
     *                              "left"-value to add
     * @param {Float} _offsetY
     *                              "top"-value to add
     */
    this.offsetSlicegroup = function(_slicegroupInt,_offsetValue){
         var slicegroup = this.slicegroups[_slicegroupInt-1];
         slicegroup.offsetSlicegroup(_offsetValue);
         this.update();
     };
    /**
     * Searches the Slicegroup with the given groupId and returns it if found.
     * @param {type} _slicegroupIdInt
     *                                  groupId of the slicegroup to get
     * @returns {Slicegroup}
     */
    // TODO: fix and test (compare ids)
//    this.getSlicegroupById = function(_slicegroupIdInt){
//         if (this.slicegroups.length !== 0){
//            return this.slicegroups[_slicegroupIdInt - 1];
//        } else {
//            return null;
//        }
//     };
    /**
     * Finds the slicegroup that contains the Slice with the given Id and returns it.
     * Returns null if that group or slice doesnt exist
     * @param {type} _sliceIdInGroupInt
     *                                  Id of a Slice within the group to find
     * @returns {Slicegroup}
     */
    this.findSlicegroupContaining = function(_sliceIdInGroupInt){
         for (var i=0;i<this.slicegroups.length;i++){
             var currentSG = this.slicegroups[i];
             if (currentSG.isSliceInGroup(_sliceIdInGroupInt)){
                 return currentSG;
             }
         }
         return null;
     };
    /////////////////////////////////////////////////////////////////
    ////////////////////// END Slicegroups //////////////////////////
    /////////////////////////////////////////////////////////////////
    /**
     * Updates the HTML of the Pie using properties of the slices.
     * Checks that key-properties are in place
     * 
     * 1) Removes all HTML-slices
     * 2) Checks that ids of the slices start with 1 and increase by 1 each
     * 3) updates the following slices (id + percentages) if the ids dont match the pattern
     * 4) adds HTML-slices with updated properties
     * 
     */
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
            if (current.equals(it.first())) {
                    current.newId(1);
                    _startingPercentage = current.percentageStart();
//                    current.setPercentages(this.firstPercentage(),current.percentageSize());
                }
            // if ids dont match the order
            if (current.hasNext() && current.id() !== (current.next.id() - 1)) {
                // start from that with updating the following ids
                current._updateFollowingIds();
            }
            if (current.hasNext() && current.percentageEnd() !== current.next.percentageStart()){
                current._updateFollowingPercentages();
            }
            current = it.next();
        }
        // and update following percentages
//        it.first()._updateFollowingPercentages();
        // adding html of Slices
        this._drawSlices();
    };
    /**
     * The Number of Slices within the pie
     * @returns {Integer}
     */
    this.count = function() {
        if (_lastSlice !== null) {
            return _lastSlice.id();
        } else
            return 0;
    };
    /**
     * Number of slicegroups in this pie
     * @returns {Integer}
     */
    this.groupCount = function() {
        return slicegroups.length;
    };
    //-----------------------------------------------------------------------//
    // inner-Object Slice //////////
    /** Object representation of a slice of the pie.
     * Background will be set to a color if a css color is given or to an image
     * if an url(..) is given in _backgroundStr.
     * 
     * @param {type} _pie - the pie this slice belongs to
     * @param {Int} _percentageInt 
     *                          value how big the slice will be in percent of the pie
     * @param {Int} _percentageStartInt - value at which the slice starts (0=top mid of circle)
     * @param {String} _backgroundStr - String with either a legal CSS Color or an url(...) to an image
     * @returns {Pie.Slice}
     */
    function Slice(_pie, _percentageInt, _percentageStartInt, _backgroundStr) {
        // TODO: adding possibility to insertSlice between some others
        var pie = _pie;
        // ID //////////////////////////
        var _id = 1;
        if (pie.first() !== null) {
            // use id of currentSlice because insertion will always be behind the currentSlice
            _id = (pie.current().id()) + 1;
        }
        this.id = function() {
            return _id;
        };
        this.newId = function(idInt) {
            _id = idInt;
        };
        // BACKGROUND //////////////////
        var _background = _backgroundStr;
        this.setBackground = function(_backgroundStr){
            if (_backgroundStr !== null){
                _background = _backgroundStr;
            }
        };
        this.background = function (){
            return _background;
        };
        //-------------------------------------------------------------------//
        var _offsetX = 0;
        var _offsetY = 0;
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
        // TODO: make next/previous private!
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
            return pie.createSlice(_percentageCovered, _percentageStartingAt, _background, _offsetX, _offsetY);
        };
        /**
         * Method offsets the slice by given values for top/right
         * @param {Float} _topNum - Value to move the Slice by
         * @param {Float} _leftNum - Value to move the Slice by
         */
        this._moveSlice = function(_topNum,_leftNum){
            _offsetX += _leftNum;
            _offsetY += _topNum;
        };
        /**
         * Moves a Slice away from the center of the circle by the given value.
         * Moving Vector is the half angle between starting and ending angle/percentage
         * of the Slice.
         * 
         * @param {type} _offsetToMiddleInt
         *                                  Value to move the Slice by
         */
        this._offset = function(_offsetToMiddleInt){
            var percentageMid = (this.percentageStart() + this.percentageEnd()) / 2;
                // calculating vector through triangle
                var degree = pie.percentageToDegree(percentageMid);
                var rad = pie.percentageToRadiant(percentageMid);
//                var hypo = (pie.size()/2); // Point on circle / mid if degrees from slice / searched vector
//                var cos = Math.abs(Math.cos(degree));
//                var sin = Math.abs(Math.sin(degree));
                var cos = Math.cos(rad);
                var sin = Math.sin(rad);
                ////// Probe /////////////
                // sin = gegenkathete / Hypotenuse
                // gegenkathete = Hypo * sin
//                vectorX = hypo * sin;
//                alert("vectorX= " + vectorX);
                // cos = ankathete / Hypothenuse
                // ankathete = Hypo * cos
//                vectorY = hypo * cos;
//                alert("vectorY= " + vectorY);
                var vectorMoveX = 0.0;
                var vectorMoveY = 0.0;
                    vectorMoveX = (_offsetToMiddleInt * sin)/2;
                    vectorMoveY = -(_offsetToMiddleInt * cos)/2;
                this._moveSlice(vectorMoveY, vectorMoveX);
        };
    };
    Slice.prototype = {
        /**
         * Checks if the calling Slice equals the passed Slice
         * @param {Slice} _sliceToCompareTo
         * @returns {Boolean}
         */
        equals: function(_sliceToCompareTo) {
            // TODO: more parameters for comparisson and perhaps compare() method
            var equalId = this.id() === _sliceToCompareTo.id();
            if (equalId) {
                return true;
            }
        },
        /** updates all ids to be increasing by 1 each slice */
        _updateFollowingIds: function() {
            var next = this.next;
            if (next !== null) {
                next.newId((this.id()) + 1);
                next._updateFollowingIds();
            }
//                alert("currently processing: " + this.id()); // DEBUGG INFO
            return;
        },
        /**
         * updates all following slices to have their starting percentage
         * set to the previous ending percentage
         */
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
            if (this.equals(_sliceToFind)) {
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
        _findSlice: function(_idToFindInt) {
            if (this.id() === _idToFindInt) {
//                alert("found " + this.id());
                return this;
            } else if (this.next !== null) {
                return this.next._findSlice(_idToFindInt);
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
    //------------------------------------------------------------------------//
    // how to define Slicegroup as a Slice? (extends, vererbung)
    /**
     * Slicegroup Objects are used to group up slices and use the same 
     * manipulation on all of them equally.
     * Slicegroups are not organized as linked Elements, 
     * so they have to be managed from outside.
     * 
     * @param {type} _pie
     *                              Pie Object that the slicegroup belongs to
     * @param {type} _sliceArray
     *                              Array with all Slices to group together
     *                              !!has to be ordered from lowest id to highest!!
     * @returns {Pie.Slicegroup}
     */
    function Slicegroup(_pie,_sliceArray){
        // TODO: fix the order-dependency of _sliceArray
        var pie = _pie;
        var _groupId;
        _groupId = pie.slicegroups.length + 1;
        this.id=function(){
            return _groupId;
        };
        // Slices ///////////////////////////////////////////
        this.slices = [];
        for (var i = 0; i < _sliceArray.length; i++){
//            console.log("slice pushed in group: " + _sliceArray[i].id()); // DEBUGG INFO
            this.slices.push(_sliceArray[i]);
        };
        /**
         * Returns the n-th slice within the group.
         * @param {type} _sliceInt
         *                          Number of the slice within the group (n-th)
         * @returns {Slice}
         */
        this.slice = function(_sliceInt){
            var sliceIndexInt = _sliceInt -1;
            // TODO automatic ordering of the given slices by id
            if (sliceIndexInt < _sliceArray.length){
                return slices[sliceIndexInt];
            }
            else return null;
        };
        /**
         * Moves all Slices of the group.
         * @param {type} _offsetX
         *                          "left" value to add
         * @param {type} _offsetY
         *                          "top" value to add
         */
        this.moveSlicegroup = function(_offsetX, _offsetY){
            for (var i = 0; i< this.slices.length; i++){
                this.slices[i]._moveSlice(_offsetX, _offsetY);
                console.log("moved slices: "+ this.slices[i].id()); // debugg
            };
        };
        /**
         * Moves a Slicegroup away from the center of the circle by the given value.
         * Moving Vector is the half angle between starting and ending angle/percentage
         * of the Slice.
         * @param {Float} _offsetValueNum
         *                                  Value to move the group away from the center
         */
        this.offsetSlicegroup = function(_offsetValueNum){
                var percentageMid = (this.slices[0].percentageStart() + this.slices[(this.slices.length-1)].percentageEnd()) / 2;
                // calculating vector through triangle
                var degree = pie.percentageToDegree(percentageMid);
                var rad = pie.percentageToRadiant(percentageMid);
                var cos = Math.cos(rad);
                var sin = Math.sin(rad);
                var vectorMoveX = 0.0;
                var vectorMoveY = 0.0;
                    vectorMoveX = (_offsetValueNum * sin)/2;
                    vectorMoveY = -(_offsetValueNum * cos)/2;
              this.moveSlicegroup(vectorMoveY, vectorMoveX);
                
        };
        /**
         * Checks if the Slice with the given id is in this Slicegroup.
         * @param {type} _sliceIdInt
         * @returns {Boolean}
         */
        this.isSliceInGroup = function(_sliceIdInt){
            var found = false;
            for (var i = 0; i< this.slices.length; i++){
                if (this.slices[i].id() === _sliceIdInt){
                    found = true;
                }
            }
            return found;
        };
    };
    /////////////////////////////////////////////////////////////////////////////////
    //------------------------------------------------------------------------//
    /**
     * Iterator doesnt affect the references within the pie.
     * If Elements are changed during a loop through multiple iterators 
     * might lead to unexpected results.
     * 
     * Use iterator() to get your Iterator
     * @param {type} _pie
     * @returns {Pie.Iterator}
     */
    function Iterator(_pie) {
        var _currentSlice = _pie.first();
        this.first = function() {
            return _pie.first();
        };
        this.last = function() {
            return _pie.last();
        };
        this.current = function(){
            return _currentSlice;
        };
        this.next = function() {
            _currentSlice = _currentSlice.next;
            return _currentSlice;
        };
        this.previous = function() {
            _currentSlice = _currentSlice.previous;
            return _currentSlice.previous;
        };
        /**
         * Checks if there is a next slice and if so changes the cursor to it!
         * @returns {Boolean} true if nextSlice equals currentslice
         */
        this.hasNext = function() {
            if (_currentSlice.equals(this.next())){
                return false;
            }
            else return true;
        };
        /**
         * Checks if there is a previous slice and if so changes the cursor to it!
         * @returns {Boolean} true if previousSlice equals currentslice
         */
        this.hasPrevious = function() {
            if (_currentSlice.equals(this.previous())){
                return false;
            }
            else return true;
        };
    };
    /**
     * Returns an Iterator for the pie
     * @returns {Pie.Iterator}
     */
    this.iterator = function() {
        return new Iterator(this);
    };
}; // Pie END //////////////////////////////////////////////////////////////////
/** Contains basic Methods neccessary to create a pie and its slices */
Pie.prototype = { // Pie.prototype Start ///////////////////////////////////////
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
    createSlice: function(_percentageInt, _percentageStartInt, _backgroundStr, _offsetX, _offsetY) {
        var sliceHtml = this._createSlice(_percentageInt, _percentageStartInt, _backgroundStr);
        sliceHtml.style.top = _offsetY + "" + this.sizeUnit();
        sliceHtml.style.left = _offsetX + "" + this.sizeUnit();
        if (parseInt(_offsetX) !== 0 || parseInt(_offsetY) !== 0){
            sliceHtml.style.zIndex += 1;
        }
        return sliceHtml;
    },     
//    createSliceLink: function(_percentageInt, _percentageStartInt, _linkURLStr, _basecolorStr, _offsetX, _offsetY){
        // TODO WIP
//        var sliceLink = document.createElement("a");
//        var sliceHtml = this._createSlice(_percentageInt, _percentageStartInt, true, _basecolorStr, null);
//        sliceLink.appendChild(sliceHtml);
//                
//        sliceLink.style.top = _offsetY + "" + this.sizeUnit();
//        sliceLink.style.left = _offsetX + "" + this.sizeUnit();
//        if (parseInt(_offsetX) !== 0 || parseInt(_offsetY) !== 0){
//            sliceLink.style.zIndex += 1;
//        }
//        return sliceLink;
//    },
    _createSlice: function(_percentageInt, _percentageStartInt, _backgroundStr) {
        if (_percentageInt <= 50) {
            var sliceHtml = this._createSlimSlice(_percentageInt, _percentageStartInt, _backgroundStr);
        }
        else {
            var sliceHtml = this._createBigSlice(_percentageInt, _percentageStartInt, _backgroundStr);
        }
//        sliceHtml.style.top = _offsetY + "" + this.sizeUnit();
//        sliceHtml.style.left = _offsetX + "" + this.sizeUnit();
//        if (parseInt(_offsetX) !== 0 || parseInt(_offsetY) !== 0){
//            sliceHtml.style.zIndex += 1;
//        }
        return sliceHtml;
    },
    /**
     * creates Slice of up to 50% value
     * @param {Int} _percentageInt - percentage value the slice contains
     * @param {Int} _percentageStartInt - percentage value to start the slice at
     * @param {String} _colorString color of the slice as String (any legal css colorvalue)
     * @returns {"div"} Container with the big Slice
     */
    _createSlimSlice: function(_percentageInt, _percentageStartInt, _backgroundStr) {
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
            // strong blink at 4 slices [10,10,60,10]
        }

        //New Slice Fill
        var sliceFill = this._createSliceFill(_backgroundStr);
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
        sliceContainer.style.position = "absolute";
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
    _createSliceFill: function(_backgroundStr) {
        var size = this.size();
        var unit = this.sizeUnit();
        var sizeString = this.sizeString();
        var fillHtml = document.createElement("div");
        // identify background
        if(_backgroundStr.indexOf("url")  === 0){ // if it starts with "url(...)" its an image
            fillHtml.style.backgroundImage = _backgroundStr;
        } else { // it is a color
        fillHtml.style.backgroundColor = _backgroundStr;
        }
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
    /**
     * Converts percentage value into rad value
     */
     percentageToRadiant: function(_percentageInt){
         var degree = Pie.prototype.percentageToDegree(_percentageInt);
         return (degree*Math.PI)/180;
     },
}; // Pie.prototype END ////////////////////////////////////////////////////////
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
    return pieContainer.html();
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
    return pieObject.html();
}