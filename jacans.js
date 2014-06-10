/**
 * JAvasCrANvaS (JACANS): A plugin for JQuery that manipulates and draws on the HTML5 Canvas Element
 * @author Flavio Diez
 */

/*******************************************************************************
 * GLOBALS
 ******************************************************************************/
var canvas;
var canvas_context;
var tmpCanvas; 
var tmpContext;
var toolChoice;
var lines = [];
 
$(document).ready(function() {

	/*
	 * Get canvas and context
	 */
	canvas = $("#mainCanvas")[0];

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
	tmpCanvas = document.createElement('canvas');

	

	tmpCanvas.id = 'tmpCanvas';
	tmpCanvas.width = canvas.width;
	tmpCanvas.height = canvas.height;
	$(canvas).parent().append(tmpCanvas);

	tmpContext = tmpCanvas.getContext('2d');

	/*
	 * Set up listeners
	 */
	
	// Canvas
	$(tmpCanvas).on("mousedown", function(event) {
		brain(event);
	});
	$(tmpCanvas).on("mousemove", function(event) {
		brain(event);
	});
	$(tmpCanvas).on("mouseup", function(event) {
		brain(event);
	});

	// Buttons
	$("#clearButton").on("click", function(event) {
		lines =  []
		clearCanvas(canvas, canvas_context);
	});
	$("#backButton").on("click", function(event) {
		popLine();
	});
	$("#horizButton").on("click", function(event) {
		$(".tool").removeClass("active");
		$(this).addClass("active");
		toolChoice = new tools[$('.tool.active').attr('name')]();
	});
	$("#vertButton").on("click", function(event) {
		$(".tool").removeClass("active");
		$(this).addClass("active");
		toolChoice = new tools[$('.tool.active').attr('name')]();
	});
	
	//
});

function brain(event){
	getMousePosition(event);
	
	if(tools[$('.tool.active').attr('name')]){
		var func = toolChoice[event.type];
		
		if(func){
			func(event);
		}
	}
}

  // This object holds the implementation of each drawing tool.
  var tools = {};

//The horizontal line tool
  tools.horizontalLine = function () {
    var tool = this;
    this.started = false;

    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
        tmpContext.beginPath();
		tmpContext.moveTo(0, ev.mouseY);
		tmpContext.lineTo(tmpCanvas.width, ev.mouseY);
		tmpContext.stroke();
        tool.started = true;
    };

    // This function is called every time you move the mouse. Obviously, it only 
    // draws if the tool.started state is set to true (when you are holding down 
    // the mouse button).
    this.mousemove = function (ev) {
      if (tool.started) {
		clearCanvas(tmpCanvas, tmpContext);
        tmpContext.beginPath();
		tmpContext.moveTo(0, ev.mouseY);
		tmpContext.lineTo(tmpCanvas.width, ev.mouseY);
		tmpContext.stroke();
      }
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
    	lines.push([0, ev.mouseY, tmpCanvas.width, ev.mouseY]);
        tool.mousemove(ev);
        tool.started = false;
        img_update();
      }
    };
  };
  
//The vertical line tool
  tools.verticalLine = function () {
    var tool = this;
    this.started = false;

    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
        tmpContext.beginPath();
		tmpContext.moveTo(ev.mouseX, 0);
		tmpContext.lineTo(ev.mouseX, tmpCanvas.height);
		tmpContext.stroke();
        tool.started = true;
    };

    // This function is called every time you move the mouse. Obviously, it only 
    // draws if the tool.started state is set to true (when you are holding down 
    // the mouse button).
    this.mousemove = function (ev) {
      if (tool.started) {
		clearCanvas(tmpCanvas, tmpContext);
        tmpContext.beginPath();
        tmpContext.moveTo(ev.mouseX, 0);
		tmpContext.lineTo(ev.mouseX, tmpCanvas.height);
		tmpContext.stroke();
      }
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
    	lines.push([ ev.mouseX, 0, ev.mouseX, tmpCanvas.height]);
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
	
	if (e.offsetX) {
		e.mouseX = e.offsetX;
		e.mouseY = e.offsetY;
	} else if (e.layerX) {
		e.mouseX = e.layerX;
		e.mouseY = e.layerY;
	}

}

// Clear canvas of any line
function clearCanvas(canvas, ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
}


// Update the image by redrawing the lines
function img_update () {
	clearCanvas(canvas, canvas_context);
	lines.forEach(function(elem){
		canvas_context.beginPath();
		canvas_context.moveTo(elem[0], elem[1]);
		canvas_context.lineTo(elem[2], elem[3]);
		canvas_context.stroke();
	});
	tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
}

// Delete last draw image and redraw rest
function popLine() {
	lines.pop();
	img_update();
}



