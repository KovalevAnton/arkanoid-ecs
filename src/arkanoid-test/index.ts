import { createMachine, interpret } from 'xstate';
import { Game } from './Game';
import './index.css';

let game: Game | null = null;
const stateMachine = createMachine(
	{
		initial: 'init',
		states: {
			init: {
				on: {
					PRELOAD: 'preload',
				},
				onEntry: 'initAction',
			},
			preload: {
				on: {
					RUN: 'run',
					ERROR: 'error',
				},
				onEntry: 'preloadAction',
			},
			run: {
				on: {
					LAZYLOAD: 'lazyLoad',
					ERROR: 'error',
				},
				onEntry: 'runAction',
			},
			lazyLoad: {
				on: {
					ERROR: 'error',
				},
				onEntry: 'lazyAction',
				type: 'final',
			},
			error: {
				onEntry: 'errorAction',
			},
		},
	},
	{
		actions: {
			initAction: (context, event) => {
				console.warn('init action', event);
				game = new Game();
				stateService.send('PRELOAD');
			},
			preloadAction: (context, event) => {
				console.warn('preload action', event);
				if (game) {
					game.preload(() => {
						stateService.send('RUN');
					});
				} else stateService.send('ERROR');
			},
			runAction: (context, event) => {
				console.warn('run action', event);
				if (game) {
					game.populate();
					game.run();
					stateService.send('LAZYLOAD');
				}
			},
			lazyAction: (context, event) => {
				console.warn('lazyload action', event);
			},
			errorAction: (context, event) => {
				console.warn('error action', event);
			},
		},
	}
);

const stateService = interpret(stateMachine);

export async function example(): Promise<void> {
	stateService.start();
}
