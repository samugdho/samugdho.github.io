// @ts-check
/**
 * @typedef {(entity: any) => {x: number, y: number}} Positioning
 */
class QuadTreeProto {
	/**
	 * A quatree node
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 */
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		/** @type {QuadTreeNode[]} */
		this.nodes = [];
		/** @type {any} */
		this.entity = null;
	}
}
export default class QuadTree extends QuadTreeProto {
	/**
	 * A quatree node
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 */
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this._positioning = null;
	}
	/**
	 * 
	 * @param {Positioning} fcn 
	 */
	positioning(fcn) {
		this._positioning = fcn;
	}
	/**
	 * 
	 * @param {any} entity 
	 */
	add(entity) {
		QuadTree.add(this, entity, this._positioning);
	}
	/**
	 * 
	 * @param {any} entity 
	 */
	place(entity) {
		QuadTree.place(this, entity, this._positioning);
	}
	update() {
		QuadTree.update(this, this._positioning);
	}
	/**
	 * 
	 * @param {any} entity 
	 */
	remove(entity) {
		QuadTree.remove(this, entity);
	}
	get find() {
		let tree = this;
		let positioning = tree._positioning;
		if (!positioning) {
			console.error('Positioning function not set');
		}
		return {
			/**
			 * Find entities near a point (+ radius). Return sorted by distance
			 * @param {number} x 
			 * @param {number} y 
			 * @param {number} radius Default 0 (Max 1 result)
			 * @param {number} limit Total number of results to return. Default: 0 (no limit)
			 */
			near(x, y, radius = 0, limit = 0) {
				if (!positioning) return [];
				// Find valid nodes
				let nodes = QuadTree.findNodesNearPoint(tree, x, y, radius);
				// Get entities
				return QuadTree.findResultNodes(nodes, positioning, x, y, limit);
			},
			/**
			 * Find entities inside a rectangle
			 * @param {number} x 
			 * @param {number} y 
			 * @param {number} w 
			 * @param {number} h 
			 * @param {number} limit Total number of results to return. Default: 0 (no limit)
			 */
			inside(x, y, w, h, limit = 0) {
				if (!positioning) return [];
				// Find valid nodes
				let nodes = QuadTree.findNodesInsideRect(tree, x, y, w, h);
				// Get entities
				return QuadTree.findResultNodes(nodes, positioning, x + w / 2, y + h / 2, limit);
			}
		}
	}
	/**
	 * 
	 * @param {(QuadTreeNode | QuadTree)[]} nodes 
	 * @param {Positioning} positioning 
	 * @param {number} cx 
	 * @param {number} cy 
	 * @param {number} limit default: 0
	 * @returns 
	 */
	static findResultNodes(nodes, positioning, cx, cy, limit = 0) {
		let entities = QuadTree.distancifyNodes(nodes, positioning, cx, cy);
		entities = QuadTree.sortAndLimitEntities(entities, limit);
		return {
			entities: entities,
		}
	}
	/**
	 * 
	 * @param {{entity: any, distance: number}[]} entities 
	 * @param {number} limit default: 0
	 */
	static sortAndLimitEntities(entities, limit = 0) {
		let e = [...entities];
		e.sort((a, b) => a.distance - b.distance);
		if (limit > 0) e = e.slice(0, limit);
		return e;
	}
	/**
	 * 
	 * @param {(QuadTreeNode | QuadTree)[]} nodes 
	 * @param {Positioning} positioning 
	 * @param {number} cx 
	 * @param {number} cy 
	 * @returns 
	 */
	static distancifyNodes(nodes, positioning, cx, cy) {
		return nodes.filter(n => n.entity !== null).map(n => {
			let p = positioning(n.entity);
			return {
				entity: n.entity,
				distance: Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2)
			}
		});
	}
	/**
	 * 
	 * @param {QuadTreeNode | QuadTree} node 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} radius 
	 */
	static findNodesNearPoint(node, x, y, radius) {
		/**
		 * @type {(QuadTreeNode | QuadTree)[]}
		 */
		let nodes = [];
		if (node.nodes.length == 0) return [node];
		for (let i = 0; i < node.nodes.length; i++) {
			let n = node.nodes[i];
			let intersect = this.circleRectIntersect(x, y, radius, n.x, n.y, n.w, n.h);
			if (intersect) {
				nodes = nodes.concat(this.findNodesNearPoint(n, x, y, radius));
				if (radius == 0) break; // Zero radius, only one node
			}
		}
		return nodes;
	}
	/**
	 * 
	 * @param {number} cx 
	 * @param {number} cy 
	 * @param {number} radius 
	 * @param {number} rx 
	 * @param {number} ry 
	 * @param {number} rw 
	 * @param {number} rh 
	 * @returns 
	 */
	static circleRectIntersect(cx, cy, radius, rx, ry, rw, rh) {
		// temporary variables to set edges for testing
		let testX = cx;
		let testY = cy;

		// which edge is closest?
		if (cx < rx) testX = rx;      // test left edge
		else if (cx > rx + rw) testX = rx + rw;   // right edge
		if (cy < ry) testY = ry;      // top edge
		else if (cy > ry + rh) testY = ry + rh;   // bottom edge

		// get distance from closest edges
		let distX = cx - testX;
		let distY = cy - testY;
		let distance = Math.sqrt((distX * distX) + (distY * distY));

		// if the distance is less than the radius, collision!
		if (distance <= radius) {
			return true;
		}
		return false;
	}
	/**
	 * 
	 * @param {QuadTreeNode | QuadTree} node 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 * @returns 
	 */
	static findNodesInsideRect(node, x, y, w, h) {
		if (node.nodes.length == 0) return [node];
		let nodes = [];
		for (let i = 0; i < node.nodes.length; i++) {
			let n = node.nodes[i];
			let intersect = this.rectRectIntersect(x, y, w, h, n.x, n.y, n.w, n.h);
			if (intersect) {
				nodes = nodes.concat(this.findNodesInsideRect(n, x, y, w, h));
			}
		}
		return nodes;
	}
	/**
	 * 
	 * @param {number} r1x 
	 * @param {number} r1y 
	 * @param {number} r1w 
	 * @param {number} r1h 
	 * @param {number} r2x 
	 * @param {number} r2y 
	 * @param {number} r2w 
	 * @param {number} r2h 
	 * @returns 
	 */
	static rectRectIntersect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {

		// are the sides of one rectangle touching the other?

		if (r1x + r1w >= r2x &&    // r1 right edge past r2 left
			r1x <= r2x + r2w &&    // r1 left edge past r2 right
			r1y + r1h >= r2y &&    // r1 top edge past r2 bottom
			r1y <= r2y + r2h) {    // r1 bottom edge past r2 top
			return true;
		}
		return false;
	}
	/**
	 * 
	 * @param {QuadTreeNode | QuadTree} node 
	 * @param {any} entity 
	 * @param {Positioning | null} positioning 
	 */
	static add(node, entity, positioning) {
		if (!positioning) {
			console.error('No positioning function set');
			return;
		}
		if (!node.entity && node.nodes.length === 0) {
			node.entity = entity;
			return;
		}
		// Subdivision
		if (node.nodes.length === 0) {
			this.split(node);
		}
		// Placement
		this.place(node, entity, positioning);

		if (!node.entity) return;
		this.place(node, node.entity, positioning);
		node.entity = null;
	}
	/**
	 * Split node into 4 squares
	 * @param {QuadTree | QuadTreeNode} node 
	 */
	static split(node) {
		let w2 = node.w / 2;
		let h2 = node.h / 2;
		let x = node.x;
		let y = node.y;
		let nodes = [
			new QuadTreeNode(node, x, y, w2, h2),
			new QuadTreeNode(node, x + w2, y, w2, h2),
			new QuadTreeNode(node, x, y + h2, w2, h2),
			new QuadTreeNode(node, x + w2, y + h2, w2, h2),
		]
		node.nodes = nodes;
	}
	/**
	 * 
	 * @param {QuadTreeNode | QuadTree} node 
	 * @param {any} entity 
	 * @param {Positioning | null} positioning 
	 */
	static place(node, entity, positioning) {
		if (!positioning) {
			console.error('No positioning function set');
			return;
		}
		if (node.nodes.length === 0) {
			console.error('No nodes');
			return;
		}
		let { x, y } = positioning(entity);
		for (let i = 0; i < node.nodes.length; i++) {
			let n = node.nodes[i];
			let outofbounds = QuadTree.outofbounds(x, y, n.x, n.y, n.w, n.h);
			if (!outofbounds) {
				this.add(n, entity, positioning);
				return;
			}
		}
		// Is out of bounds
		if (node instanceof QuadTree) {
			console.error(QuadTree.OutOfBoundsErrorText(x, y, node));
			return;
		}
		let parent = node.parent;
		parent.place(entity);
	}
	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {QuadTreeNode | QuadTree} node 
	 * @returns 
	 */
	static OutOfBoundsErrorText(x, y, node) {
		return `Entity out of bounds: (${x}, ${y}) | node: ${node.x}, ${node.y}, ${node.w + node.x}, ${node.h + node.y}`
	}
	/**
	 * 
	 * @param {QuadTreeNode | QuadTree} node 
	 * @param {Positioning | null} positioning 
	 */
	static update(node, positioning) {
		if (!positioning) {
			console.error('No positioning function set');
			return;
		}
		if (node.entity) {
			// Single entity
			let { x, y } = positioning(node.entity);
			let outofbounds = QuadTree.outofbounds(x, y, node.x, node.y, node.w, node.h);
			if (!outofbounds) {
				return;
			}
			if (node instanceof QuadTree) {
				console.error(QuadTree.OutOfBoundsErrorText(x, y, node));
				return;
			}
			let parent = node.parent;
			let oldEntity = node.entity;
			node.entity = null;
			parent.place(oldEntity);
			return;
		}

		for (let i = 0; i < node.nodes.length; i++) {
			let n = node.nodes[i];
			n.update();
		}

	}
	/**
	 * 
	 * @param {number} ex 
	 * @param {number} ey 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 * @returns 
	 */
	static outofbounds(ex, ey, x, y, w, h) {
		return ex < x || ex >= x + w || ey < y || ey >= y + h;
	}
	/**
	 * 
	 * @param {QuadTreeNode | QuadTree} node 
	 * @param {any} entity 
	 * @returns 
	 */
	static remove(node, entity) {
		if (node.entity === entity) {
			node.entity = null;
			return;
		}
		for (let i = 0; i < node.nodes.length; i++) {
			let n = node.nodes[i];
			n.remove(entity);
		}
	}
}

export class QuadTreeNode extends QuadTreeProto {
	/**
	 * 
	 * @param {QuadTree | QuadTreeNode} parent 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 */
	constructor(parent, x, y, w, h) {
		super(x, y, w, h);
		this.parent = parent;
	}
	get tree() {
		let p = this.parent;
		while (p instanceof QuadTreeNode) {
			p = p.parent;
		}
		return p;
	}
	/**
	 * 
	 * @param {any} entity 
	 */
	add(entity) {
		let tree = this.tree;
		QuadTree.add(this, entity, tree._positioning);
	}
	/**
	 * 
	 * @param {any} entity 
	 */
	place(entity) {
		let tree = this.tree;
		QuadTree.place(this, entity, tree._positioning);
	}
	update() {
		let tree = this.tree;
		QuadTree.update(this, tree._positioning);
	}
	/**
	 * 
	 * @param {any} entity 
	 */
	remove(entity) {
		let tree = this.tree;
		QuadTree.remove(this, entity);
	}
}