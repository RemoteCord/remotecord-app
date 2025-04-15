export const TitleBarButton: React.FC<{
	children: React.ReactNode;

	toggle: () => void;
}> = ({ children, toggle }) => {
	return (
		<button
			onClick={toggle}
			className="hover:bg-secondary p-2 h-8 rounded-lg flex items-center justify-center aspect-square transition-all duration-300"
		>
			{children}
		</button>
	);
};
