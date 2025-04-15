import * as React from "react";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";

const animation = {
	enter: {
		y: -10,
		transition: {
			duration: 0.3,
		},
	},
	exit: {
		y: 0,
		transition: {
			duration: 0.2,
		},
	},
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);

const InputAnimated = React.forwardRef<
	HTMLInputElement,
	HTMLMotionProps<"input">
>(({ className, type, ...props }, ref) => {
	const [focus, setFocus] = React.useState(false);

	return (
		<motion.input
			onFocus={() => setFocus(true)}
			onBlur={() => setFocus(false)}
			animate={focus ? "enter" : "exit"}
			variants={animation}
			type={type}
			className={cn(
				"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
});
Input.displayName = "Input";

export { Input, InputAnimated };
