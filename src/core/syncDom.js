/**
 * @ref https://github.com/DylanPiercey/set-dom
 * @todo need a huge refactor to clear code
 */

const Core = {
	DEBUG: false,
	KEY: 'data-key',
	IGNORE: 'data-ignore',
	CHECKSUM: 'data-checksum',
	KEY_PREFIX: '_sync-dom-',
	ELEMENT_TYPE: 1,
	DOCUMENT_TYPE: 9,
	DOCUMENT_FRAGMENT_TYPE: 11,
	parseHTML: function(){},

	/**
	 * @private
	 * @description
	 * Updates a specific htmlNode and does whatever it takes to convert it to another one.
	 *
	 * @param {Node} oldNode - The previous HTMLNode.
	 * @param {Node} newNode - The updated HTMLNode.
	 */
	setNode: function(oldNode, newNode) {

		if ( oldNode.nodeType === newNode.nodeType ) {

			// Handle regular element node updates.
			if ( oldNode.nodeType === Core.ELEMENT_TYPE ) {

				// Checks if nodes are equal before diffing.
				if ( Core.isEqualNode(oldNode, newNode) ) return;
		
				// Update all children (and subchildren).
				Core.setChildNodes(oldNode, newNode);
		
				// Update the elements attributes / tagName.
				if ( oldNode.nodeName === newNode.nodeName ) {

					// If we have the same nodename then we can directly update the attributes.
					Core.setAttributes(oldNode.attributes, newNode.attributes)

				} else {

					// Otherwise clone the new node to use as the existing node.
					var newPrev = newNode.cloneNode();

					// Copy over all existing children from the original node.
					while (oldNode.firstChild) newPrev.appendChild(oldNode.firstChild);

					// Replace the original node with the new one with the right tag.
					oldNode.parentNode.replaceChild(newPrev, oldNode);
				}

			} else {

				// Handle other types of node updates (text/comments/etc).
				// If both are the same type of node we can update directly.
				if ( oldNode.nodeValue !== newNode.nodeValue ) {
					oldNode.nodeValue = newNode.nodeValue
				}
			}

		} else {

			// we have to replace the node.
			oldNode.parentNode.replaceChild(newNode, Core.dismount(oldNode))
			Core.mount(newNode)
		}
	},

	/**
	 * @private
	 * @description
	 * Utility that will update one list of attributes to match another.
	 *
	 * @param {NamedNodeMap} oldAttributes - The previous attributes.
	 * @param {NamedNodeMap} newAttributes - The updated attributes.
	 */
	setAttributes: function(oldAttributes, newAttributes) {
		var i, a, b, ns, name;
	
		// Remove old attributes.
		for (i = oldAttributes.length; i--;) {
			a = oldAttributes[i]
			ns = a.namespaceURI
			name = a.localName
			b = newAttributes.getNamedItemNS(ns, name)
			if ( !b ) oldAttributes.removeNamedItemNS(ns, name)
		}
	
		// Set new attributes.
		for (i = newAttributes.length; i--;) {
			a = newAttributes[i]
			ns = a.namespaceURI
			name = a.localName
			b = oldAttributes.getNamedItemNS(ns, name)

			if ( !b ) {

				// Add a new attribute.
				newAttributes.removeNamedItemNS(ns, name)
				oldAttributes.setNamedItemNS(a)

			} else if (b.value !== a.value) {

				// Update existing attribute.
				b.value = a.value
			}
		}
	},

	/**
	 * @private
	 * @description
	 * Utility that will nodes childern to match another nodes children.
	 *
	 * @param {Node} oldParent - The existing parent node.
	 * @param {Node} newParent - The new parent node.
	 */
	setChildNodes: function(oldParent, newParent) {
		var checkOld, oldKey, checkNew, newKey, foundNode, keyedNodes;
		var oldNode = oldParent.firstChild;
		var newNode = newParent.firstChild;
		var extra = 0;
	
		// Extract keyed nodes from previous children and keep track of total count.
		while (oldNode) {
			extra++
			checkOld = oldNode
			oldKey = Core.getKey(checkOld)
			oldNode = oldNode.nextSibling
		
			if ( oldKey ) {
				if (!keyedNodes) keyedNodes = {};
				keyedNodes[oldKey] = checkOld;
			}
		}
	
		// Loop over new nodes and perform updates.
		oldNode = oldParent.firstChild
		while (newNode) {
			extra--
			checkNew = newNode
			newNode = newNode.nextSibling
		
			if ( keyedNodes && (newKey = Core.getKey(checkNew)) && (foundNode = keyedNodes[newKey]) ) {
				
				delete keyedNodes[newKey]

				// If we have a key and it existed before we move the previous 
				// node to the new position if needed and diff it.
				if ( foundNode !== oldNode ) {
					oldParent.insertBefore(foundNode, oldNode)

				} else {

					oldNode = oldNode.nextSibling
				}
		
				Core.setNode(foundNode, checkNew);

			} else if (oldNode) {
				checkOld = oldNode
				oldNode = oldNode.nextSibling

				if ( Core.getKey(checkOld) ) {

				// If the old child had a key we skip over it until the end.
				oldParent.insertBefore(checkNew, checkOld)
				Core.mount(checkNew)

				} else {
					// Otherwise we diff the two non-keyed nodes.
					Core.setNode(checkOld, checkNew)
				}

			} else {
				
				// Finally if there was no old node we add the new node.
				oldParent.appendChild(checkNew)
				Core.mount(checkNew)
			}
		}
	
		// Remove old keyed nodes.
		for (oldKey in keyedNodes) {
			extra--
			oldParent.removeChild(Core.dismount(keyedNodes[oldKey]))
		}
	
		// If we have any remaining unkeyed nodes remove them from the end.
		while (--extra >= 0) {
			oldParent.removeChild(Core.dismount(oldParent.lastChild))
		}
	},

	/**
	 * @private
	 * @description
	 * Utility to try to pull a key out of an element.
	 * Uses 'data-key' if possible and falls back to 'id'.
	 *
	 * @param {Node} node - The node to get the key for.
	 * @return {string|void}
	 */
	getKey: function(node) {
		if (node.nodeType !== Core.ELEMENT_TYPE) return;
		var key = node.getAttribute(Core.KEY) || node.id
		if (key) return Core.KEY_PREFIX + key
	},

	/**
	 * Checks if nodes are equal using the following by checking if
	 * they are both ignored, have the same checksum, or have the
	 * same contents.
	 *
	 * @param {Node} a - One of the nodes to compare.
	 * @param {Node} b - Another node to compare.
	 */
	isEqualNode: function(a, b) {
		return (
			// Check if both nodes are ignored.
			(Core.isIgnored(a) && Core.isIgnored(b)) ||

			// Check if both nodes have the same checksum.
			(Core.getCheckSum(a) === Core.getCheckSum(b)) ||

			// Fall back to native isEqualNode check.
			a.isEqualNode(b)
		);
	},

	/**
	 * @private
	 * @description
	 * Utility to try to pull a checksum attribute from an element.
	 * Uses 'data-checksum' or user specified checksum property.
	 *
	 * @param {Node} node - The node to get the checksum for.
	 * @return {string|NaN}
	 */
	getCheckSum: function(node) {
		return node.getAttribute(Core.CHECKSUM) || NaN
	},

	/**
	 * @private
	 * @description
	 * Utility to try to check if an element should be ignored by the algorithm.
	 * Uses 'data-ignore' or user specified ignore property.
	 *
	 * @param {Node} node - The node to check if it should be ignored.
	 * @return {boolean}
	 */
	isIgnored: function(node) {
		return node.getAttribute(Core.IGNORE) != null
	},

	/**
	 * Dispatches a mount event for the given node and children.
	 *
	 * @param {Node} node - the node to mount.
	 * @return {node}
	 */
	mount: function(node) {
		return Core.dispatch(node, 'mount')
	},

	/**
	 * Dispatches a dismount event for the given node and children.
	 *
	 * @param {Node} node - the node to dismount.
	 * @return {node}
	 */
	dismount: function(node) {
		return Core.dispatch(node, 'dismount')
	},

	/**
	 * Recursively trigger an event for a node and it's children.
	 * Only emits events for keyed nodes.
	 *
	 * @param {Node} node - the initial node.
	 * @return {Node}
	 */
	dispatch: function(node, type) {

		// Trigger event for this element if it has a key.
		if ( Core.getKey(node) ) {
			var ev = document.createEvent('Event')
			var prop = { value: node }
			ev.initEvent(type, false, false)
			Object.defineProperty(ev, 'target', prop)
			Object.defineProperty(ev, 'srcElement', prop)
			node.dispatchEvent(ev)
		}
	
		// Dispatch to all children.
		var child = node.firstChild
		while (child) child = Core.dispatch(child, type).nextSibling
		return node
	},

	/**
	 * @private
	 * @description
	 * Confirm that a value is truthy, throws an error message otherwise.
	 *
	 * @param {*} val - the val to test.
	 * @param {string} msg - the error message on failure.
	 * @throws {Error}
	 */
	assert: function(val, msg) {
		if (!val) throw new Error('sync-dom: ' + msg)
	},

	setConfig: function(options={}){

		Core.DEBUG = options.debug;

	},
}

Core.NODE_MOUNTED = Core.KEY_PREFIX + 'mounted';

/**
 * @description
 * Updates existing dom to match a new dom.
 *
 * @param {Node} oldNode - The html entity to update.
 * @param {String|Node} newNode - The updated html(entity).
 * @param {object} options
 * @param {bool} options.debug
 */
const syncDOM = function(oldNode, newNode, options=null) {

	// Ensure a realish dom node is provided.
	Core.assert(oldNode && oldNode.nodeType, 'You must provide a valid node to update.');

	if ( options ) Core.setConfig(options);

	// Alias document element with document.
	if ( oldNode.nodeType === Core.DOCUMENT_TYPE ) oldNode = oldNode.documentElement

	// Document Fragments don't have attributes, so no need to look 
	// at checksums, ignored, attributes, or node replacement.
	if ( newNode.nodeType === Core.DOCUMENT_FRAGMENT_TYPE ) {

		// Simply update all children (and subchildren).
		Core.setChildNodes(oldNode, newNode)

	} else {

		// Otherwise we diff the entire old node.
		Core.setNode(oldNode, typeof newNode === 'string'

			// If a string was provided we will parse it as dom.
			? Core.parseHTML(newNode, oldNode.nodeName)
			
			: newNode
		)
	}

	// Trigger Core.mount events on initial set.
	if ( !oldNode[Core.NODE_MOUNTED] ) {
		oldNode[Core.NODE_MOUNTED] = true;
		Core.mount(oldNode);
	}
}

export default syncDOM;