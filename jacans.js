/**
 * JAvasCrANvaS (JACANS): A plugin for JQuery that manipulates and draws on the HTML5 Canvas Element
 * @author Flavio Diez
 */
 
 $( document ).ready(function(){
	var canvas = document.getElementById("canvas_1");
	if (canvas.getContext){
		var canvas_context = canvas.getContext("2d");
	}
 
	$("#canvas_1").on("click", function(event){
		drawHorizontal(event, canvas, canvas_context);
	});
	
	
 });
 
 function drawHorizontal(event, canvas, ctx){
	mouse = getMousePosition(event);
	ctx.moveTo(mouse[0], mouse[1]);
	ctx.lineTo(mouse[0], canvas.width);
	ctx.stroke();
 }
 
 
 // Helper function
 function getMousePosition(e)
{
    var mouseX, mouseY;

    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    return [mouseX, mouseY]
}