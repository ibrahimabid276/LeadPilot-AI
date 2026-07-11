import { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return (
    <div className={`rounded-lg border ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: CardProps) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children }: CardProps) {
  return (
    <h3 className={`font-semibold ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ className = "", children }: CardProps) {
  return (
    <div className={`px-4 pb-4 ${className}`}>
      {children}
    </div>
  );
}
