import * as PIXI from 'pixi.js';

type Arguments = {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	scale?: number;
	container?: PIXI.Container;
	parent?: number;
};

export class ObjectComponent {
	container: PIXI.Container;
	x: number;
	y: number;
	width: number;
	height: number;
	scale: number;
	angle = 0;
	parent: number | undefined;
	children: Set<number> = new Set();
	constructor({ x, y, width, height, scale = 1, container, parent }: Arguments = {}) {
		this.container = container ?? new PIXI.Container();
		this.container.width = this.width = width ?? 0;
		this.container.height = this.height = height ?? 0;
		this.container.x = this.x = x ?? 0;
		this.container.y = this.y = y ?? 0;
		this.scale = scale;
		this.container.scale.set(scale);
		this.parent = parent;
	}
}
