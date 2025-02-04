"use client"
import SidebarTrigger from "@/components/custom/sidebar-trigger"
import DashboardBreadcrumb from "./breadcrumb"
import UploadButton from "./upload-button"
import HeaderProfile from "./header-profile"

const DashboardHeader = () => {
    return (
        <header className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4 justify-start flex-1">
                <SidebarTrigger />
                <DashboardBreadcrumb/>
            </div>
            <div className="w-full h-fit flex items-center gap-4 justify-end flex-1">
                <UploadButton/>
                <HeaderProfile/>
            </div>
        </header>
    )
}

export default DashboardHeader