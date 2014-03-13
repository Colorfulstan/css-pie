css-pie (Object Oriented)
=======

A JavaScript Library that allows you to create a dynamic CSS3 Pie Chart anywhere on your webpage. Pure CSS results or JS Object possible depending on your needs.

If you only need a plain circle divided into colored sections you should check out https://github.com/AliBassam/css-pie
for the much smaller original script.


The Object Oriented Version lets you create and handle Pie-Objects 
and comes with handy Methods for creating and manipulating slices.

A Quickstart-page can be found under http://colorfulstan.github.io/css-pie/ 
with Examples for the most important features.

WIP:
----


-------------------------------------------------------------------
IF YOU WANT TO CONTRIBUTE:
- Don´t hesitate to make suggestions, comments or critize constructively (Sometimes I forget to apply my own rules and 4 eyes see more then 2 etc :) )
- keep Methods small (1 "normal" screen height for all of the code at max) and with speaking names
- dont use global variables AT ALL - create your variables where you need them or pass them as parameters
- comment heavily + use the given structure for documenting your Methods (JavaDoc Format)
- Elements for the Pie-Instances (each created Object contains them) go into Pie = function(...){...}
- Elements for the Prototype (one for all Instances) go into Pie.prototype
- Mark private elements of Objects with a starting _ on the name (e.g. _privateMethod / _privateVariable)
- Public Library-Methods go separatly (see createPie)
- Never Change an existing public Method - Mark it as @deprecated and create the new one with different Parameters
- Use Object oriented design (divide and conquer) for your Methods or mark them through a visible Comment for // REVISION


Possibly Todo:
---------
- integration of css-classes (HIGH PRIORITY)
- handling number of slices != number of percentages
- handling sum of percentages > 100
- handling slice-movement (should it change size of the wrapping/container?
- options to manipulate slices already created
- (option to divide the pie in equal slices after creation)
- integration of css-transitions
- integration of animations (explosion effect with offsetslice)
- integration of different Tags then div (img, a)
- integration of Captions and labels
- more options for styling the pie and the slices(.classes perhaps)
- ...
