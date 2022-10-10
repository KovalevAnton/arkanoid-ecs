import * as PIXI from 'pixi.js';

export class StickComponent {
	stick: PIXI.Graphics;

	constructor({}: any = {}) {
		this.stick = new PIXI.Graphics().beginFill(0x46879).drawRect(0, 0, 145, 25).endFill();
		this.stick.tint = 0x46879;
	}
}
