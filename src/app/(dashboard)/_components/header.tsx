"use client"
import SidebarTrigger from "@/components/custom/sidebar-trigger"
import DashboardBreadcrumb from "./breadcrumb"

const DashboardHeader = () => {
    return (
        <header className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4 justify-start">
                <SidebarTrigger />
                <DashboardBreadcrumb/>
            </div>
        </header>
    )
}

export default DashboardHeader