import { World } from '@releaseband/ecs';
import * as PIXI from 'pixi.js';

import { EventEmitter } from './EventEmitter';

import { ObjectComponent } from './components/ObjectComponent';
import { BallComponent } from './components/BallComponent';
import { StickComponent } from './components/StickComponent';

import { GameAreaSystem } from './systems/GameAreaSystem';
import { BallSystem } from './systems/BallSystem';
import { StickSystem } from './systems/StickSystem';

const spawnEntity = (world: World, components: unknown[]): number => {
	const entity = world.createEntity();
	// @ts-ignore
	for (const component of components) world.addComponent(entity, component);
	return entity;
};

export class Game {
	world: World;
	app: PIXI.Application;
	resources: any | null = null;

	constructor() {
		const world = new World(500);

		world.registerComponent(ObjectComponent);
		world.registerComponent(BallComponent);
		world.registerComponent(StickComponent);

		const app = new PIXI.Application({
			width: 1024,
			height: 673,
			backgroundColor: 0x1099bb,
		});

		const appDiv = document.createElement('div');
		appDiv.className = 'app';
		appDiv.innerHTML = `<div class="ui-container">
			<div class="button button-play">
				<div class="button-title">PLAY</div>
				<svg height="128px" style="enable-background:new 0 0 24 32;" version="1.1" viewBox="0 0 24 32" width="128px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Layer_1"/><g id="play"><polygon points="0,0 24,16 0,32  " style="fill:#4E4E50;"/></g></svg>
			</div>
			<div class="button button-stop">
				<div class="button-title"> STOP</div>
				<svg height="128px" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="128px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Layer_1"/><g id="stop"><rect height="32" style="fill:#4E4E50;" width="32"/></g></svg>
			</div>
		</div>
		<div class="game-container"></div>`;
		document.body.appendChild(appDiv);

		const gameContainer = document.querySelector('.game-container') as HTMLElement;
		gameContainer.appendChild(app.renderer.view);

		const playButton = document.querySelector('.button-play') as HTMLElement;
		const stopButton = document.querySelector('.button-stop') as HTMLElement;

		playButton.onpointerdown = () => {
			stopButton.style.display = 'block';
			playButton.style.display = 'none';
			EventEmitter.getInstance().emit('start', 15);
		};
		stopButton.onpointerdown = () => {
			stopButton.style.display = 'none';
			playButton.style.display = 'block';
			EventEmitter.getInstance().emit('stop', 15);
		};

		EventEmitter.getInstance().on('stop', () => {
			stopButton.style.display = 'none';
			playButton.style.display = 'block';
		});

		this.app = app;
		this.world = world;
	}

	async preload(onLoadCallback: CallableFunction) {
		const promises: Promise<void>[] = [];
		promises.push(
			new Promise<void>((resolve, reject) => {
				this.app.loader
					.add('gameField', './assets/gameField.webp')
					.add('DVD_logo', './assets/DVD_logo.webp')
					.load((loader, resources) => {
						this.resources = resources;
						console.warn('sprites loaded');
						resolve();
					});
			})
		);

		await Promise.all(promises)
			.then((result) => onLoadCallback())
			.catch((err) => console.warn('error loading resources'));
	}

	run() {
		const gameContainer = new PIXI.Container();
		this.app.stage.addChild(gameContainer);

		const backgroundBall = PIXI.Sprite.from(this.resources.DVD_logo.data);
		backgroundBall.anchor.set(0.5);
		backgroundBall.x = 10;
		backgroundBall.y = 10;
		backgroundBall.scale.set(0.05);

		this.world.addSystem(new GameAreaSystem(this.world, gameContainer));
		this.world.addSystem(new BallSystem(this.world, backgroundBall));
		this.world.addSystem(new StickSystem(this.world));

		let lastTimestamp = 16;

		const run = (timestamp = 0) => {
			const dt = timestamp - lastTimestamp;
			lastTimestamp = timestamp;
			this.world.update(dt);
			this.app.renderer.render(this.app.stage);
			requestAnimationFrame(run);
		};
		run();
	}

	populate() {
		if (this.resources) {
			const backgroundContainer = new PIXI.Container();
			const background = PIXI.Sprite.from(this.resources.gameField.data);

			background.scale.set(1.36);
			backgroundContainer.addChild(background);
			this.app.stage.addChild(backgroundContainer);

			const symbol = spawnEntity(this.world, [new ObjectComponent({ width: 330, height: 610 })]);

			spawnEntity(this.world, [
				new ObjectComponent({ width: 25, height: 25, parent: symbol }),
				new BallComponent(),
			]);

			spawnEntity(this.world, [
				new ObjectComponent({ width: 125, height: 25, parent: symbol }),
				new StickComponent(),
			]);
		}
	}
}
