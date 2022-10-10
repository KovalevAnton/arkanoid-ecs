import * as PIXI from 'pixi.js';

export class BallComponent {
	ball: PIXI.Graphics;

	constructor({}: any = {}) {
		this.ball = new PIXI.Graphics().beginFill().drawRect(0, 0, 1, 1).endFill();
	}
}
