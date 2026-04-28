import { useNode } from '@craftjs/core';

export default function withControl(WrappedComponent: React.ComponentType<any>): React.ComponentType<any> {
	return function ControlWrapper(): React.ReactNode {
		const {
			actions: { setProp },   
			props: nodeProps,
		} = useNode( ( node ) => ( {
			props: node.data.props,
		} ) );

		const setAttribute = ( attrKey: string, value: any ) => {
			setProp( ( prev: any ) => ( prev[ attrKey ] = value ) );
		};

		return (
			<WrappedComponent
				attributes={ nodeProps }
				setAttribute={ setAttribute }
			/>
		);
	};
}
