/**
 * JAvasCrANvaS (JACANS): A plugin for JQuery that manipulates and draws on the HTML5 Canvas Element
 * @author Flavio Diez
 */

(function($){
	$.fn.jacans = function( options ){
		// Configuration
		var settings = $.extend({
			canvasElement: "#canvas",
			panTool: "#pan",
			rotateTool: "#rotate",
			resizeTool: "#resize",
			horizontalLineOpt: "#horizontalLine",
			verticalLineOpt: "#verticalLine",
			twoPointsLineOpt: "#twoPointsLine"
		}, options );
		
		// Variables


		// Listeners

		// METHODS
		 
		/**
		 * Draws a horizontal line inside the canvas element
		 *
		 * @param 
		 * @return
		 */
		function drawHorizontalLine(){

		}

		/**
		 * Draws a vertical line inside the canvas element
		 *
		 * @param 
		 * @return 
		 */
		function drawVerticalLine(){

		}

		/**
		 * Draws a line inside the canvas element based on 2 coordinate pair
		 *
		 * @param 
		 * @return 
		 */
		function draw2PointsLine(){

		}
		
		/**
		 * Moves the image inside the canvas element
		 *
		 * @param 
		 * @return 
		 */
		function movePan(){

		}
		
		/**
		 * Rotates the image inside the canvas element with 
		 *
		 * @param 
		 * @return 
		 */
		function moveRotate(){

		}
		
		/**
		 * Draws a line inside the canvas element based on 2 coordinate pair
		 *
		 * @param 
		 * @return 
		 */
		function moveResize(){

		}
	};


})(jQuery);