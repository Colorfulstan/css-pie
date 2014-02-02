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
function createPie(pieNameStr,pieSizePxStr,basecolorsStrArr,numberOfSlicesInt,percentagesIntArr,colorsStrArr){
	var sizeNum = parseFloat(pieSizePxStr.replace("px",""));
	//Pie Container
	var pieContainer = document.createElement("div");
	pieContainer.id=pieNameStr;
	pieContainer.style.display="inline-block";
	//Pie Background
	var pieBackground = document.createElement("div");
	pieBackground.style.width=pieSizePxStr;
	pieBackground.style.height=pieSizePxStr;
	pieBackground.style.position="relative";
	pieBackground.style.webkitBorderRadius=pieSizePxStr;
	pieBackground.style.mozBorderRadius=pieSizePxStr;
	pieBackground.style.borderRadius=pieSizePxStr;
	pieBackground.style.backgroundColor=basecolorsStrArr;
	//Append Background to Container
	pieContainer.appendChild(pieBackground);
	//Loop through Slices
	var beforeDegree = 0;
	var degree = 0;
	for(var i=0;i<numberOfSlicesInt;i++){
		//New Slice
		var newSlice = document.createElement("div");
		newSlice.style.position="absolute";
		newSlice.style.top="0px"; newSlice.style.left="0px";
		newSlice.style.width=pieSizePxStr;
		newSlice.style.height=pieSizePxStr;
		newSlice.style.webkitBorderRadius=pieSizePxStr;
		newSlice.style.mozBorderRadius=pieSizePxStr;
		newSlice.style.borderRadius=pieSizePxStr;
		newSlice.style.clip="rect(0px,"+sizeNum+"px,"+sizeNum+"px,"+((sizeNum)/2)+"px)";
		//New Slice Pie
		var pie = document.createElement("div");
		pie.style.backgroundColor=colorsStrArr[i];
		pie.style.position="absolute";
		pie.style.top="0px"; pie.style.left="0px";
		pie.style.width = pieSizePxStr;
		pie.style.height = pieSizePxStr; 
		pie.style.webkitBorderRadius = pieSizePxStr;
		pie.style.mozBorderRadius = pieSizePxStr;
		pie.style.borderRadius = pieSizePxStr;
		pie.style.clip = "rect(0px, "+((sizeNum)/2)+"px, "+sizeNum+"px, 0px)";
		//Get Percentage
		var piePercentage = percentagesIntArr[i];
		//Check if Percentage > 50
		if(piePercentage<=50){
			degree = parseFloat((180*piePercentage)/50);
			pie.style.webkitTransform="rotate("+degree+"deg)";
			pie.style.mozTransform="rotate("+degree+"deg)";
			pie.style.transform="rotate("+degree+"deg)";
			newSlice.appendChild(pie);
			//If it's not first slice, then ...
			if(i!=0){
				newSlice.style.webkitTransform="rotate("+beforeDegree+"deg)";
				newSlice.style.mozTransform="rotate("+beforeDegree+"deg)";
				newSlice.style.transform="rotate("+beforeDegree+"deg)";
			}
			pieBackground.appendChild(newSlice);
			beforeDegree += degree;
		}
		else{	
			newSlice.style.clip="rect(0px,"+(sizeNum)+"px,"+(sizeNum)+"px,"+((sizeNum-100)/2)+"px)";
			newSlice.style.webkitTransform="rotate("+beforeDegree+"deg)";
			newSlice.style.mozTransform="rotate("+beforeDegree+"deg)";
			newSlice.style.transform="rotate("+beforeDegree+"deg)";
			pie.style.webkitTransform="rotate(180deg)";
			pie.style.mozTransform="rotate(180deg)";
			pie.style.transform="rotate(180deg)";
			newSlice.appendChild(pie);
			pieBackground.appendChild(newSlice);
			var newSlice = document.createElement("div");
			newSlice.style.position="absolute";
			newSlice.style.top="0px"; newSlice.style.left="0px";
			newSlice.style.width=pieSizePxStr;
			newSlice.style.height=pieSizePxStr;
			newSlice.style.webkitBorderRadius=pieSizePxStr;
			newSlice.style.mozBorderRadius=pieSizePxStr;
			newSlice.style.borderRadius=pieSizePxStr;
			newSlice.style.clip="rect(0px,"+sizeNum+"px,"+sizeNum+"px,"+((sizeNum)/2)+"px)";
			if(i!=0)
				beforeDegree = beforeDegree-1;
			newSlice.style.webkitTransform="rotate("+(180+beforeDegree)+"deg)";
			newSlice.style.mozTransform="rotate("+(180+beforeDegree)+"deg)";
			newSlice.style.transform="rotate("+(180+beforeDegree)+"deg)";
			if(i!=0)
				beforeDegree = beforeDegree+1;
			var pie = document.createElement("div");
			pie.style.backgroundColor=colorsStrArr[i];
			pie.style.position="absolute";
			pie.style.top="0px"; pie.style.left="0px";
			pie.style.width = pieSizePxStr;
			pie.style.height = pieSizePxStr; 
			pie.style.webkitBorderRadius = pieSizePxStr;
			pie.style.mozBorderRadius = pieSizePxStr;
			pie.style.borderRadius = pieSizePxStr;
			pie.style.clip = "rect(0px, "+((sizeNum)/2)+"px, "+sizeNum+"px, 0px)";
			degree = parseFloat(((piePercentage-50)*180)/50);
			if(i!=0)
				degree=degree+1;
			pie.style.webkitTransform="rotate("+degree+"deg)";
			pie.style.mozTransform="rotate("+degree+"deg)";
			pie.style.transform="rotate("+degree+"deg)";
			if(i!=0)
				degree = degree-1;
			newSlice.appendChild(pie);
			pieBackground.appendChild(newSlice);
			beforeDegree += (180+degree);
		}
	}
	return pieContainer;	
}
