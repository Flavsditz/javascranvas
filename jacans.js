/**
 * JAvasCrANvaS (JACANS): A plugin for JQuery that manipulates and draws on the HTML5 Canvas Element
 * @author Flavio Diez
 */

/*******************************************************************************
 * GLOBALS
 ******************************************************************************/

$(document).ready(function() {

	/*
	 * Get canvas and context
	 */
	var canvas = $("#mainCanvas")[0];
	var canvas_context;

	if (!canvas) {
		console.log('Error: I cannot find the canvas element!');
		// alert('Error: I cannot find the canvas element!');
		return;
	}

	if (!canvas.getContext) {
		console.log('Error: no canvas.getContext!');
		// alert('Error: no canvas.getContext!');
		return;
	} else {
		canvas_context = canvas.getContext("2d");
	}

	if (!canvas_context) {
		console.log('Error: failed to getContext!');
		// alert('Error: failed to getContext!');
		return;
	}

	/*
	 * Create a temporary canvas to be drawn upon
	 */
	var tmpCanvas = document.createElement('canvas');

	}

	tmpCanvas.id = 'tmpCanvas';
	tmpCanvas.width = canvas.width;
	tmpCanvas.height = canvas.height;
	$("#mainCanvas").parent().append(tmpCanvas);

	var tmpContext = canvas.getContext('2d');

	/*
	 * Set up listeners
	 */
	
	// Canvas
	$("#mainCanvas").on("mousedown", function(event) {
		brain(event, canvas, canvas_context);
	});
	$("#mainCanvas").on("mousemove", function(event) {
		brain(event, canvas, canvas_context);
	});
	$("#mainCanvas").on("mouseup", function(event) {
		brain(event, canvas, canvas_context);
	});

	// Buttons
	$("#clearButton").on("click", function(event) {
		clearCanvas(canvas, canvas_context);
	});
	$("#horizButton").on("click", function(event) {
		$(this).toggleClass("active");
	});
	$("#vertButton").on("click", function(event) {
		$(this).toggleClass("active");
	});
	
	//
});

function brain(event){
	mouse = getMousePosition(event);
	line = $('.tool .active').attr('name');
	
	if(tools[line]){
		var func = line[event.type];
		func(event);
	}
}

function drawHorizontal(event, canvas, ctx) {
	mouse = getMousePosition(event);
	ctx.beginPath();
	ctx.moveTo(0, mouse[1]);
	ctx.lineTo(canvas.width, mouse[1]);
	ctx.stroke();
}

function drawVertical(event, canvas, ctx) {
	mouse = getMousePosition(event);
	ctx.moveTo(mouse[0], 0);
	ctx.lineTo(mouse[0], canvas.height);
	ctx.stroke();
}

  // This object holds the implementation of each drawing tool.
  var tools = {};

  // The drawing pencil.
  tools.horizontalLine = function () {
    var tool = this;
    this.started = false;

    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    };

    // This function is called every time you move the mouse. Obviously, it only 
    // draws if the tool.started state is set to true (when you are holding down 
    // the mouse button).
    this.mousemove = function (ev) {
      if (tool.started) {
        context.lineTo(ev._x, ev._y);
        context.stroke();
      }
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update();
      }
    };
  };


/*******************************************************************************
 * Helper functions
 ******************************************************************************/
function getMousePosition(e) {
	var mouseX, mouseY;

	if (e.offsetX) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	} else if (e.layerX) {
		mouseX = e.layerX;
		mouseY = e.layerY;
	}

	return [ mouseX, mouseY ]
}

// Clear canvas of any line
function clearCanvas(canvas, ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
}


// Update the image
function img_update (ctx_main, ctx_tmp, canvas) {
	ctx_main.drawImage(canvas, 0, 0);
	ctx_tmp.clearRect(0, 0, canvas.width, canvas.height);
}