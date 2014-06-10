/**
 * JAvasCrANvaS (JACANS): A plugin for JQuery that manipulates and draws on the
 * HTML5 Canvas Element
 * 
 * @author Flavio Diez
 */

(function($){
	$.fn.jacans = function( options ){
		// Configuration
		var settings = {
			panTool: "panTool",
			rotateTool: "rotateTool",
			resizeTool: "resizeTool",
			horizontalLineOpt: "horizontalLine",
			verticalLineOpt: "verticalLine",
			twoPointsLineOpt: "twoPointsLine"
		};
		
		// Global variables
		var mainCanvas;
		var mainContext;
		var tmpCanvas;
		var tmpContext;
		
		var toolChoice;
		var lines = [];

		// METHODS
		var methods = { 
			/**
			 * Initialize the canvas element with the tools and listeners
			 * 
			 * @param {jQuery
			 *            element} tgt The target of the plugin
			 * @return
			 */
			"init" : function(tgt){
				mainCanvas = tgt;
				
				if (!mainCanvas.is("canvas")){
					console.log("Element type Error: The plugin is made to work on a canvas element. The selected element doesn't seem to be a canvas...")
				}
				// Get context
				if (!mainCanvas) {
					console.log('Error: I cannot find the canvas element!');
					
					return;
				}

				if (!mainCanvas.getContext) {
					console.log('Error: no canvas.getContext!');
					
					return;
				} else {
					mainContext = mainCanvas.getContext("2d");
				}

				if (!mainContext) {
					console.log('Error: failed to getContext!');
					
					return;
				}
				
				
				// Create a temporary canvas to be drawn upon
				tmpCanvas = document.createElement('canvas');

				tmpCanvas.id = 'tmpCanvas';
				tmpCanvas.width = mainCanvas.width;
				tmpCanvas.height = mainCanvas.height;
				mainCanvas.parent().append(tmpCanvas);

				tmpContext = tmpCanvas.getContext('2d');
				
				
				// Set up listeners for canvas element
				tmpCanvas.on("mousedown", function(event) {
					methods.brain(event);
				});
				tmpCanvas.on("mousemove", function(event) {
					methods.brain(event);
				});
				tmpCanvas.on("mouseup", function(event) {
					methods.brain(event);
				});
				
				
				// Create and set up listeners for buttons
				
				var clearBtn = $(document.createElement("input")).attr("TYPE", "Button").attr("VALUE" ,"  Clear  ").attr("id", "clearButton");
				var backBtn = $(document.createElement("input")).attr("TYPE", "Button").attr("VALUE" ,"  Back  ").attr("id", "backButton");

				var horzBtn = $(document.createElement("input")).attr("TYPE", "Button").attr("VALUE" ,"  ----  ").attr("id", settings.horizontalLineOpt).attr("id", "horizontalLine").addClass("tool"); 
				var vertBtn = $(document.createElement("input")).attr("TYPE", "Button").attr("VALUE" ,"  ----  ").attr("id", settings.verticalLineOpt).attr("id", "verticalLine").addClass("tool");
				
				clearBtn.on("click", function(event) {
					lines =  []
					clearCanvas(canvas, canvas_context);
				});
				backBtn.on("click", function(event) {
					popLine();
				});
				horzBtn.on("click", function(event) {
					methods.lineChange($(this));
				});
				vertBtn.on("click", function(event) {
					methods.lineChange($(this));
				});
				
				mainCanvas.parent().append(clearBtn, backBtn, horzBtn, vertBtn);
			},	
			
			/**
			 * Controls the tool change and passing from events to elements
			 * 
			 * @param
			 * @return
			 */
			"lineChange" : function(line){
				$(".tool").removeClass("active");
				line.addClass("active");
				toolChoice = new tools[$('.tool.active').attr('name')]();
			},
				
			/**
			 * Controls the tool change and passing from events to elements
			 * 
			 * @param
			 * @return
			 */
			"brain" : function(ev){
				methods.getMousePosition(event);
				
				if(tools.[$('.tool.active').attr('name')]){
					var func = toolChoice[event.type];
					
					if(func){
						func(event);
					}
				}
			},
			
			/**
			 * Gets the mouse position
			 * 
			 * @param
			 * @return
			 */
			"getMousePosition" : function(e) {
				
				if (e.offsetX) {
					e.mouseX = e.offsetX;
					e.mouseY = e.offsetY;
				} else if (e.layerX) {
					e.mouseX = e.layerX;
					e.mouseY = e.layerY;
				}

			},
			
			/**
			 * Clear canvas of everything
			 * 
			 * @param
			 * @return
			 */
			"clearCanvas" : function(canvas, ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height)
			},
			
			/**
			 * Draws the content of the temporary canvas into the main canvas
			 * 
			 * @param
			 * @return
			 */
			"img_update" : function() {
				clearCanvas(mainCanvas, mainContext);
				lines.forEach(function(elem){
					mainContext.beginPath();
					mainContext.moveTo(elem[0], elem[1]);
					mainContext.lineTo(elem[2], elem[3]);
					mainContext.stroke();
				});
				tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
			},
			
			
			// Delete last draw image and redraw rest
			"popLine" : function() {
				lines.pop();
				img_update();
			},
	
			/**
			 * Draws a line inside the canvas element based on 2 coordinate pair
			 * 
			 * @param
			 * @return
			 */
			"draw2PointsLine" : function(){
	
			},
			
			/**
			 * Moves the image inside the canvas element
			 * 
			 * @param
			 * @return
			 */
			"movePan" : function(){
	
			},
			
			/**
			 * Rotates the image inside the canvas element with
			 * 
			 * @param
			 * @return
			 */
			"moveRotate" : function(){
	
			},
			
			/**
			 * Draws a line inside the canvas element based on 2 coordinate pair
			 * 
			 * @param
			 * @return
			 */
			"moveResize" : function(){
	
			}
		};
		
		// This object holds the implementation of each drawing tool.
		  var tools = {
			    /**
				 * Draws a horizontal line inside the canvas element
				 * 
				 * @param
				 * @return
				 */
			  "horizontalLine" : function () {
			    var tool = this;
			    this.started = false;
	
			    // This is called when you start holding down the mouse button.
			    // This starts the pencil drawing.
			    "mousedown" : function (ev) {
			        tmpContext.beginPath();
					tmpContext.moveTo(0, ev.mouseY);
					tmpContext.lineTo(tmpCanvas.width, ev.mouseY);
					tmpContext.stroke();
			        tool.started = true;
			    };
	
			    // This function is called every time you move the mouse.
				// Obviously,
				// it only
			    // draws if the tool.started state is set to true (when you are
				// holding down
			    // the mouse button).
			    "mousemove" : function (ev) {
			      if (tool.started) {
					clearCanvas(tmpCanvas, tmpContext);
			        tmpContext.beginPath();
					tmpContext.moveTo(0, ev.mouseY);
					tmpContext.lineTo(tmpCanvas.width, ev.mouseY);
					tmpContext.stroke();
			      }
			    };
	
			    // This is called when you release the mouse button.
			    "mouseup" : function (ev) {
			      if (tool.started) {
			    	lines.push([0, ev.mouseY, tmpCanvas.width, ev.mouseY]);
			        tool.mousemove(ev);
			        tool.started = false;
			        img_update();
			      }
			    };
			  },
			  
			    /**
				 * Draws a vertical line inside the canvas element
				 * 
				 * @param
				 * @return
				 */
			  "verticalLine" : function () {
			    var tool = this;
			    this.started = false;
	
			    // This is called when you start holding down the mouse button.
			    // This starts the pencil drawing.
			    "mousedown" : function (ev) {
			        tmpContext.beginPath();
					tmpContext.moveTo(ev.mouseX, 0);
					tmpContext.lineTo(ev.mouseX, tmpCanvas.height);
					tmpContext.stroke();
			        tool.started = true;
			    };
	
			    // This function is called every time you move the mouse.
				// Obviously,
				// it only
			    // draws if the tool.started state is set to true (when you are
				// holding down
			    // the mouse button).
			    "mousemove" : function (ev) {
			      if (tool.started) {
					clearCanvas(tmpCanvas, tmpContext);
			        tmpContext.beginPath();
			        tmpContext.moveTo(ev.mouseX, 0);
					tmpContext.lineTo(ev.mouseX, tmpCanvas.height);
					tmpContext.stroke();
			      }
			    };
	
			    // This is called when you release the mouse button.
			    "mouseup" : function (ev) {
			      if (tool.started) {
			    	lines.push([ ev.mouseX, 0, ev.mouseX, tmpCanvas.height]);
			        tool.mousemove(ev);
			        tool.started = false;
			        img_update();
			      }
			    }
			  } 
		};
		
		return this.each(function() {
            if (options) {
                $.extend(settings, options);
            }
            var target = this;
            
            methods.init(target);
           
        });
		
	};
})(jQuery);