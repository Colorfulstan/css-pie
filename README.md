css-pie (Object Oriented)
=======

A JavaScript Library that allows you to create a dynamic CSS3 Pie Chart anywhere on your webpage. Purely CSS.


The Object Oriented Version lets you create and handle Pie-Objects 
and comes with handy Methods for creating single slices.
More to Come.

-------------------------------------------------------------------
IF YOU WANT TO CONTRIBUTE:
- Don´t hesitate to make suggestions or comments 
- keep Methods small and with speaking names
- dont use global variables AT ALL - create your variables where you need them or pass them as parameters
- comment heavily + use the given structure for documenting your Methods
- Elements for the Pie-Instances (each created Object contains them) go into Pie = function(...){...}
- Elements for the Prototype (one for all Instances) go into Pie.prototype
- Public Methods go separatly (see createPie)
- Never Change an existing public Method - Mark it as @deprecated and create the new one with different Parameters
- Use Object oriented design (divide and conquer) for your Methods or mark them through a visible Comment for // REVISION
---------------------------------------------------------------------------------------

Possibly Todo:
---------
- creating Constructor for Pie()?
- option to divide the pie in equal slices
- handling number of slices != number of percentages
- handling sum of percentages > 100
- integration of css-transitions
- integration of different Tags then div (img, a)
- integration of Captions and labels
- more options for styling the pie and the slices(.classes perhaps)
- ...
