"use client"

import FileCard from "@/app/(dashboard)/_components/file-card/card"
import { P } from "@/components/custom/p"
import { IFile } from "@/lib/database/schema/file.model"
import { getFiles } from "@/lib/fetch/files.fetch"
import { RiLoader3Fill } from "@remixicon/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useState } from "react"

interface PageFilesProps {
    page: string
}

const PageFiles = ({ page }: PageFilesProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isPageFull, setIsPageFull] = useState(false);
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ["files", page],
        queryFn: async () => await getFiles({ page, currentPage }),
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    })

    if (page === "subscription") return <>Subscription</>
    if (isLoading) return <RiLoader3Fill className="animate-spin mx-auto" />
    if (error) return (
        <P size="large" weight="bold">
            Error: {error.message}
        </P>
    );

    const files = data.files as IFile[]

    if (files?.length === 0)
        return (
          <Image
            src="/not-found.png"
            width={400}
            height={400}
            className="m-auto"
            alt="not-found"
          />
        );


    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-6">
        {
            files.map((file) => (
                <FileCard  file={file} key={file._id} />
            ))
        }
        </div>
        </>
    )
}

export default PageFiles