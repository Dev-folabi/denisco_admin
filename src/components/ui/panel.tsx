interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className = "" }: PanelProps) {
  return (
    <div
      className={`rounded-[18px] border border-line bg-white p-[26px] shadow-[var(--shadow-default)] [@media(max-width:640px)]:p-4 ${className}`}
    >
      {children}
    </div>
  );
}

interface PanelHeadProps {
  children: React.ReactNode;
  className?: string;
}

export function PanelHead({ children, className = "" }: PanelHeadProps) {
  return (
    <div
      className={`mb-5 flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      {children}
    </div>
  );
}
