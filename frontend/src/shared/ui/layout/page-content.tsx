import { cn } from "@/lib/utils";

interface PageContentProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const PageContent = ({
  children,
  className,
  ...props
}: PageContentProps) => {
  return (
    <main className={cn("", className)} {...props}>
      {children}
    </main>
  );
}
