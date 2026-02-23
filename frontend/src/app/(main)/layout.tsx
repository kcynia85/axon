import { Sidebar } from "@/components/layout/Sidebar";
import { ModeToggle } from "@/shared/ui/ui/ModeToggle";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-muted/30 relative">
        <div className="absolute top-4 right-4 z-50">
          <ModeToggle />
        </div>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
