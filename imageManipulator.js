// Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
	window.addEventListener('load', function() {
		//Canvas and context variables
		var canvas, canvaso, context, contexto;

		// The active tool instance.
		var tool;
		var tool_default = 'move';

		function init() {
			// Find the canvas element.
			canvaso = document.getElementById('imgLayer');
			if (!canvaso) {
				alert('Error: I cannot find the canvas element!');
				return;
			}

			if (!canvaso.getContext) {
				alert('Error: no canvas.getContext!');
				return;
			}

			// Get the 2D canvas context.
			contexto = canvaso.getContext('2d');
			if (!contexto) {
				alert('Error: failed to getContext!');
				return;
			}

			// Add the temporary canvas.
			var container = canvaso.parentNode;
			canvas = document.createElement('canvas');
			if (!canvas) {
				alert('Error: I cannot create a new canvas element!');
				return;
			}

			canvas.id = 'drawLayer';
			canvas.width = canvaso.width;
			canvas.height = canvaso.height;
			canvas.style.position = canvaso.style.position;
			canvas.style.border = "2px solid black";
			canvas.style.top = canvaso.style.top;
			canvas.style.left = canvaso.style.left;
			canvas.style.zIndex = canvaso.style.zIndex;
			container.appendChild(canvas);

			context = canvas.getContext('2d');
			
			context.fillRect(0, 0, canvas.width, canvas.height);

			// Get the tool select input.
			var tool_select = document.getElementsByName('typeDraw');
			if (!tool_select) {
				alert('Error: failed to get the typeDraw element!');
				return;
			}

			//EVENT LISTENERS
			//move tool
			tool_select[0].onchange = ev_tool_change;
			//rotate tool
			tool_select[1].onchange = ev_tool_change;
			//resize tool
			tool_select[2].onchange = ev_tool_change;

			// Activate the default tool.
			if (tools[tool_default]) {
				tool = new tools[tool_default]();
				tool_select.value = tool_default;
			}

			// Attach the mousedown, mousemove and mouseup event listeners.
			canvas.addEventListener('mousedown', ev_canvas, false);
			canvas.addEventListener('mousemove', ev_canvas, false);
			canvas.addEventListener('mouseup', ev_canvas, false);

			//Set flags
			glineSet = false;
		}

		// The general-purpose event handler. This function just determines the mouse
		// position relative to the canvas element.
		function ev_canvas(ev) {
			if (ev.layerX || ev.layerX == 0) {// Firefox
				ev._x = ev.layerX;
				ev._y = ev.layerY;
			} else if (ev.offsetX || ev.offsetX == 0) {// Opera
				ev._x = ev.offsetX;
				ev._y = ev.offsetY;
			}

			// Call the event handler of the tool.
			var func = tool[ev.type];
			if (func) {
				func(ev);
			}
		}

		// The event handler for any changes made to the tool selector.
		function ev_tool_change(ev) {
			if (tools[this.value]) {
				tool = new tools[this.value]();
			}

		}

		// This object holds the implementation of each drawing tool.
		var tools = {};

		//This holds all the drawn lines in the canvas so it can be redrawn
		var lines = [];

		// The MOVE line tool.
		tools.move = function() {

			var lastX = 0;
			var lastY = 0;

			var tool = this;
			this.started = false;

			this.mousedown = function(ev) {
				if (tool.started) {
					tool.started = false;
					document.getElementById('drawLayer').style.cursor = "default";
				} else {
					tool.started = true;
					document.getElementById('drawLayer').style.cursor = "move";
				}
				lastX = ev._x;
				lastY = ev._y;

			};

			this.mousemove = function(ev) {
				if (!tool.started) {
					return;
				}

				//Calculate movement
				centerX = centerX + (ev._x - lastX);
				centerY = centerY + (ev._y - lastY);

				lastX = ev._x;
				lastY = ev._y;

				startDraw();
			};
		};

		// The ROTATE line tool.
		tools.rotate = function() {

			var refX = 0;
			var refY = 0;

			var tool = this;
			this.started = false;

			this.mousedown = function(ev) {
				if (tool.started) {
					tool.started = false;
					document.getElementById('drawLayer').style.cursor = "default";
				} else {
					tool.started = true;
					document.getElementById('drawLayer').style.cursor = "ne-resize";
				}
				refX = ev._x;
				refY = ev._y;

			};

			this.mousemove = function(ev) {
				if (!tool.started) {
					return;
				}

				//Calculate movement
				var dx = ev._x - refX;
				var dy = ev._y - refY;

				theta = Math.atan2(dy, dx);

				startDraw();
			};

		};

		// The RESIZE line tool.
		tools.resize = function() {
			var tool = this;
			this.started = false;

			this.mousedown = function(ev) {
				if (tool.started) {
					tool.started = false;
					document.getElementById('drawLayer').style.cursor = "default";
				} else {
					tool.started = true;
					document.getElementById('drawLayer').style.cursor = "se-resize";
				}
				refX = ev._x;
				refY = ev._y;

			};

			this.mousemove = function(ev) {
				if (!tool.started) {
					return;
				}

				//Calculate movement
				dist = ev._x - refX;
				if (dist > 0) {
					scale = scale * 1.01;
				}
				if (dist < 0) {
					scale = scale * 0.99;
				}

				refX = ev._x;
				refY = ev._y;

				startDraw();
			};

		};

		//Set handler for upload
		$('#photoimg').live('change', function() {
			$("#preview").html('');
			$("#preview").html('<img src="images/loader.gif" alt="Uploading...."/>');
			$("#imageform").ajaxForm({
				success : loadfirstImage
			}).submit();

		});

		function loadfirstImage(responseText, statusText, xhr, $form) {
			$("#preview").empty();
			$("#imgArea").css('display', 'block');

			var tmp = responseText.split("***");
			//Get center of Img
			centerY = tmp[2] / 2;
			centerX = tmp[1] / 2;

			//Set width and height
			imgHeight = tmp[2];
			imgWidth = tmp[1];

			//Set start angle and scale
			theta = 0;
			scale = 1;
			//Set Image to be draw
			setImage(tmp[0]);

		}

		setGline = function(type) {
			glineSet = true;

			gline = new Image();

			//TODO get user (pass as reference)
			gline.src = "./users/flavio/ref/" + type + ".png";

			gline.onload = function() {
				context.drawImage(gline, 0, 0);
			};

		}
		function setImage(path) {

			tmpFoto = new Image();

			tmpFoto.src = path;

			tmpFoto.onload = function() {
				context.drawImage(tmpFoto, 0, 0);
			};
		}

		function startDraw() {
			context.translate(0, 0);
			context.fillRect(0, 0, canvas.width, canvas.height);
			drawMyImage();

		}

		function drawMyImage() {
			context.save();
			context.translate(centerX, centerY);
			context.rotate(theta);
			context.drawImage(tmpFoto, centerX - (imgWidth * (scale / 1)), centerY - (imgHeight * (scale / 1)), imgWidth * (scale / 1), imgHeight * (scale / 1));
			context.restore();

			if (glineSet)
				drawGlines();
		}

		function drawGlines() {
			context.drawImage(gline, 0, 0);
		}

		saveImg = function(typeSave) {
			//Draw without lines to save
			tmp = glineSet;
			glineSet = false;
			startDraw();
			// save canvas image as data url (png format by default)
			var img = canvas.toDataURL("image/png");

			// set canvasImg image src to dataURL
			// so it can be saved as an image
			var ajax = new XMLHttpRequest();
			ajax.open("POST", 'save_backend.php', false);
			ajax.setRequestHeader('Content-Type', 'application/upload');
			ajax.send(img + '&type=' + typeSave);

			// Draw as the previous state
			gline=tmp;
			startDraw();
			
			//Show saved Status
			document.getElementById('savedMsg').style.display = 'inline-block';
			setTimeout(function() {
				document.getElementById('savedMsg').style.display = 'none';
			}, 2000);
		}
		init();
	}, false);
}
