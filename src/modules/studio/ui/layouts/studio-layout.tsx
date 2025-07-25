import { SidebarProvider } from "@/components/ui/sidebar";

import StudioSidebar from "../components/studio-sidebar";
import StudioNavbar from "../components/studio-navbar";

interface StudioLayoutProps {
  children: React.ReactNode;
}

export const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="">
        <StudioNavbar />
      </div>
      <div className="flex min-h-screen pt-[4rem]">
        <StudioSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
};
