import { Children } from "@/props/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import DashboardHeader from "./_components/header";


const Layout = ({ children }: Children) => {
  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full px-5">
          <DashboardHeader />
         
          <div className="bg-primary/5 w-full min-h-[calc(100vh-80px)] rounded-lg p-5">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
};

export default Layout;