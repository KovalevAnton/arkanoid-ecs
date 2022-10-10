import { World, Query, System } from '@releaseband/ecs';
import * as PIXI from 'pixi.js';

import { ObjectComponent } from '../components/ObjectComponent';
import { StickComponent } from '../components/StickComponent';
import { EventEmitter } from '../EventEmitter';

let leftKey = false;
let rightKey = false;
let ready = false;

export class StickSystem implements System {
	stick: Query;
	world: World;
	isPlaying: boolean;

	onAddCallback: CallableFunction;

	constructor(world: World) {
		this.world = world;
		this.isPlaying = false;

		this.onAddCallback = (entity: number) => {
			const stickComponent = world.getComponent(entity, StickComponent);
			const objectComponent = world.getComponent(entity, ObjectComponent);
			objectComponent.container.addChild(stickComponent.stick);
		};

		window.addEventListener(
			'keydown',
			function (event: KeyboardEvent) {
				if (event.key == 'ArrowLeft') leftKey = true;
				if (event.key == 'ArrowRight') rightKey = true;
				if (event.key == 'ArrowUp') ready = true;
			},
			false
		);
		window.addEventListener(
			'keyup',
			function (event: KeyboardEvent) {
				if (event.key == 'ArrowLeft') leftKey = false;
				if (event.key == 'ArrowRight') rightKey = false;
			},
			false
		);

		this.stick = world.createQuery([ObjectComponent, StickComponent]);
		this.stick.onAddSubscribe(this.onAddCallback);

		EventEmitter.getInstance().on('start', () => {
			this.isPlaying = true;
		});
		EventEmitter.getInstance().on('stop', () => {
			this.isPlaying = true;
		});
	}

	exit() {
		this.stick.onAddUnsubscribe(this.onAddCallback);
	}

	public update() {
		if (this.isPlaying) {
			for (const entity of this.stick.entities) {
				const objectComponent = this.world.getComponent(entity, ObjectComponent);

				if (leftKey) {
					objectComponent.x -= 5;
				}
				if (rightKey) {
					objectComponent.x += 5;
				}
				if (objectComponent.x < -300) {
					objectComponent.x = -300;
				}
				if (objectComponent.x > 200) {
					objectComponent.x = 200;
				}
			}
		}
	}
}
