import { Sidebar } from "@/shared/ui/layout/Sidebar";
import { ModeToggle } from "@/shared/ui/ui/ModeToggle";
import { InboxDrawer } from "@/modules/inbox/ui/InboxDrawer";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-muted/30 relative">
        <div className="absolute top-4 right-4 z-50">
          <ModeToggle />
        </div>
        {children}
      </main>
      <InboxDrawer />
    </div>
  );
};

export default MainLayout;
