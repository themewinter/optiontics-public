import { useEditor, useNode } from '@craftjs/core';
import { useCallback, useEffect, useRef } from '@wordpress/element';

const useToolboxLogic = () => {
	// Get the current node's ID and editor actions
	const { id } = useNode();
	const { actions, query, isActive } = useEditor( ( _, query ) => ( {
		isActive: query.getEvent( 'selected' ).contains( id ),
	} ) );

	// Destructure properties from the current node
	const {
		isHover,
		dom,
		name,
		moveable,
		deletable,
		connectors: { drag },
		parent,
		props,
	} = useNode( ( node ) => ( {
		isHover: node.events.hovered,
		dom: node.dom,
		name: node.data.custom.displayName || node.data.displayName,
		moveable: query.node( node.id ).isDraggable(),
		deletable: query.node( node.id ).isDeletable(),
		parent: node.data.parent,
		props: node.data.props,
	} ) );

	const currentRef = useRef<HTMLElement | null>( null );

	// Function to get the position of the DOM element
	const getPos = useCallback( ( dom: { getBoundingClientRect: () => { top: any; left: any; bottom: any; }; } ) => {
		const { top, left, bottom } = dom
			? dom.getBoundingClientRect()
			: { top: 0, left: 0, bottom: 0 };
		return {
			top: `${ top > 0 ? top - 68 : bottom }px`,
			left: `${ left }px`,
		};
	}, [] );

	// Scroll handler to update the position of the current reference
	const scroll = useCallback( () => {
		const { current: currentDOM } = currentRef;

		if ( ! currentDOM ) return;
		const { top, left } = getPos( dom as { getBoundingClientRect: () => { top: any; left: any; bottom: any; }; } );
		(currentDOM as HTMLElement).style.top = top;
		(currentDOM as HTMLElement).style.left = left;
	}, [ dom, getPos ] );

	// Effect to add/remove scroll event listener
	useEffect( () => {
		const renderer = document.querySelector( '.craftjs-renderer' );
		if ( renderer ) {
			renderer.addEventListener( 'scroll', scroll );
		}

		return () => {
			if ( renderer ) {
				renderer.removeEventListener( 'scroll', scroll );
			}
		};
	}, [ scroll ] );

	// Function to insert a node into a parent node
	const insertNodeOnParent = useCallback(
		( nodeId: string, parentId: string, indexToInsert: number, selectNodeAfterCreated = false ) => {
			const node = query.node( nodeId ).get();

			const freshNode = {
				data: {
					...node.data,
					nodes: [],
				},
			};

			const nodeToAdd = query.parseFreshNode( freshNode ).toNode();

			actions.add( nodeToAdd, parentId, indexToInsert );

			if ( node.data.nodes.length === 0 ) {
				return;
			}

			// Recursively insert child nodes
			node.data.nodes.forEach( ( childNode, index ) => {
				insertNodeOnParent( childNode, nodeToAdd.id, index );
			} );

			// Select the newly created node if specified
			if ( selectNodeAfterCreated ) actions.selectNode( nodeToAdd.id );
		},
		[ actions, query ]
	);

	// Function to duplicate the current node
	const duplicateNode = useCallback( () => {
		const parentNode = query.node( parent as string ).get();
		const indexToAdd = parentNode.data.nodes.indexOf( id ) + 1;

		insertNodeOnParent( id, parent as string, indexToAdd, true );
	}, [ id, insertNodeOnParent, parent, query ] );

	// Return the necessary properties and functions for use in components
	return {
		props,
		id,
		currentRef,
		isHover,
		isActive,
		dom,
		getPos,
		actions,
		parent,
		name,
		moveable,
		deletable,
		drag,
		duplicateNode,
	};
};
export default useToolboxLogic;
