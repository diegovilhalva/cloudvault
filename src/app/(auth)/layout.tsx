import { P } from "@/components/custom/p"
import { cn } from "@/lib/utils"
import { Children } from "@/props/types"




const Layout = ({ children }: Children) => {
  return (
    <main className="flex items-center justify-center w-full h-screen">
      <div className="flex-1 w-full h-full bg-primary md:flex items-center justify-center p-6 
      hidden">
        <div className="">
          <h1 className={cn("text-white tracking-wider")}>Cloud Vault</h1>
          <P className="text-white">
            The only solutiuon you ever need for secure files storage.
          </P>
        </div>
      </div>
      <div className="flex-1 w-full h-full  flex items-center justify-center p-4">
        {children}
      </div>
    </main>
  )
}

export default Layout