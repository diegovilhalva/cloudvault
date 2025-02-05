import { generatePageKey } from "@/lib/utils";
import PageFiles from "./_components/page-files";


interface Props {
    params:Promise<{
        page: 
        | "subscription"
        | "documents"
        | "images"
        | "videos"
        | "others"
        | "shared";}>
}
const page = async({params}:Props) => {
    const page = (await params).page 
    const key =generatePageKey(page)
  return (

    <div>
      <h1 className="capitalize">{page}</h1>
      <br />
      {page === "subscription" ? <></>: <PageFiles page={key}/>}
    </div>
  )
}

export default page