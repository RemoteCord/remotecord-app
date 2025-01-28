import type { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  type?: "submit" | "button";
}

export default function Button({
  children,
  className = "",
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      {...props}
      className={`discord-button ${className}`}
    >
      {children}
    </button>
  );
}
