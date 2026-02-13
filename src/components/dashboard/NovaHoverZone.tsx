import { ReactNode, useCallback } from "react";

interface NovaHoverZoneProps {
  id: string;
  onHover: (id: string) => void;
  children: ReactNode;
  className?: string;
}

export function NovaHoverZone({ id, onHover, children, className }: NovaHoverZoneProps) {
  const handleMouseEnter = useCallback(() => {
    onHover(id);
  }, [id, onHover]);

  return (
    <div onMouseEnter={handleMouseEnter} className={className}>
      {children}
    </div>
  );
}
