import { World, Query, System } from '@releaseband/ecs';
import * as PIXI from 'pixi.js';

import { ObjectComponent } from '../components/ObjectComponent';
import { BallComponent } from '../components/BallComponent';
import { StickComponent } from '../components/StickComponent';
import { EventEmitter } from '../EventEmitter';

const GAME_AREA_HEIGHT = 590;
const GAME_AREA_WIDTH = 310;
const BALL_SPEED = 5;
const STICK_WIDTH = 125;

export class BallSystem implements System {
	balls: Query;
	stick: Query;
	world: World;
	direction: { x: string; y: string };
	isPlaying: boolean;

	onAddCallback: CallableFunction;

	constructor(world: World, backgroundBall: any) {
		this.world = world;
		this.direction = { x: 'right', y: 'up' };
		this.isPlaying = false;
		this.onAddCallback = (entity: number) => {
			const ballComponent = world.getComponent(entity, BallComponent);
			const objectComponent = world.getComponent(entity, ObjectComponent);
			objectComponent.container.addChild(ballComponent.ball, backgroundBall);
		};

		this.balls = world.createQuery([ObjectComponent, BallComponent]);
		this.stick = world.createQuery([ObjectComponent, StickComponent]);

		this.balls.onAddSubscribe(this.onAddCallback);

		EventEmitter.getInstance().on('start', (symbols: number) => {
			this.isPlaying = true;
		});
		EventEmitter.getInstance().on('stop', () => {
			this.isPlaying = false;
		});
	}

	exit() {
		this.balls.onAddUnsubscribe(this.onAddCallback);
	}

	public update(dt: number) {
		if (this.isPlaying) {
			for (const entity of this.balls.entities) {
				for (const stickEntity of this.stick.entities) {
					const objectComponent = this.world.getComponent(entity, ObjectComponent);
					const stickComponent = this.world.getComponent(stickEntity, ObjectComponent);
					if (
						stickComponent.x <= objectComponent.x &&
						stickComponent.x + STICK_WIDTH >= objectComponent.x &&
						objectComponent.y === 5
					) {
						this.direction.y = 'up';
					}

					if (objectComponent.y > 25) {
						this.isPlaying = false;
						EventEmitter.getInstance().emit('stop', 15);
					}

					if (this.direction.y === 'up') {
						if (objectComponent.y <= -GAME_AREA_HEIGHT) {
							this.direction.y = 'down';
						} else {
							objectComponent.y = objectComponent.y - BALL_SPEED;
						}
					} else if (this.direction.y === 'down') {
						if (objectComponent.y >= 25) {
							this.direction.y = 'up';
						}
						objectComponent.y = objectComponent.y + BALL_SPEED;
					}

					if (this.direction.x === 'right') {
						if (objectComponent.x <= -GAME_AREA_WIDTH) {
							this.direction.x = 'left';
						} else {
							objectComponent.x = objectComponent.x - BALL_SPEED;
						}
					} else if (this.direction.x === 'left') {
						if (objectComponent.x >= 300) {
							this.direction.x = 'right';
						}
						objectComponent.x = objectComponent.x + BALL_SPEED;
					}
				}
			}
		}
	}
}
