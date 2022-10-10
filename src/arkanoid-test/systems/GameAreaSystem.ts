import { World, Query, System } from '@releaseband/ecs';
import { ObjectComponent } from '../components/ObjectComponent';

export class GameAreaSystem implements System {
	game: Query;
	world: World;

	constructor(world: World, parentContainer: any) {
		this.world = world;
		this.game = world.createQuery([ObjectComponent]);

		this.game.onAddSubscribe((entity: number) => {
			const child = world.getComponent(entity, ObjectComponent);
			child.y = child.height;
			child.x = child.width;
			parentContainer.addChild(child.container);

			if (typeof child.parent === 'number') {
				const parent = world.getComponent(child.parent, ObjectComponent);
				if (parent) {
					parent.container.addChild(child.container);
					parent.children.add(entity);
				}
			}
			return;
		});
	}

	public update(dt: number) {
		for (const entity of this.game.entities) {
			const component = this.world.getComponent(entity, ObjectComponent);

			const container = component.container;
			container.x = component.x;
			container.y = component.y;
			container.width = component.width;
			container.height = component.height;
			container.scale.set(component.scale);
		}
	}
}
