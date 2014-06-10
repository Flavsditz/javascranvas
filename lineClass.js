/**
 * Creates a Line Object 
 *
 * @constructor
 * @this {Line}
 * @param {number} x1 A first x point from the line.
 * @param {number} y1 A first y point from the line.
 * @param {number} x2 A second x point from the line.
 * @param {number} y2 A second y point from the line.
 */
 function Line(x1, y1, x2, y2) {
	/** @private */ this.x1 = x1;
	/** @private */ this.y1 = y1;
	/** @private */ this.x2 = x2;
	/** @private */ this.y2 = y2;
 }