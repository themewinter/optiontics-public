import Component from "./Component";
import Controls from "./Controls";

export const settings = {
	title: 'Body',
	icon: 'X',
	tags: [ 'body', 'container' ],
	category: 'general',
	canvas: true,
	component: Component,
	controls: Controls,
	attributes: {
		displayName: 'Body',
		type: "body",
		background: "#ffffff",
		color: "#000000",
		minHeight: '350px',
		minWidth: '300px',
		width: { size: 100, unit: '%' },
	},
};
