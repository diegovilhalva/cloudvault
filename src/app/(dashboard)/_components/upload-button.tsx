"use client"
import { Button } from "@/components/ui/button"
import { RiFileAddFill } from "@remixicon/react"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IFile } from "@/lib/database/schema/file.model"
import axios from "axios"


const UploadButton = () => {

    const queryClient = useQueryClient()
    const [fileProgress, setFileProgress] = useState<Record<string, number>>({})
    const [isUploading, setIsUploading] = useState(false)

    async function uploadFile(file:File){
        const formData = new FormData()
        formData.append("file",file)

        const res = await axios.post("/api/v1/files/upload",formData,{
            headers:{"Content-Type":"multipart/form-data"},
            onUploadProgress:(progressEvent) => {
                const total = progressEvent.total || 1
                const loaded = progressEvent.loaded
                const percent = Math.round((loaded/total) * 100)

                setFileProgress((prev) => ({
                    ...prev,
                    [file.name]:percent
                }))
            }
        })

        return res.data
    }
    const mutation = useMutation({
        mutationFn: uploadFile,
        onSuccess: (newData) => {
            queryClient.setQueryData(
                ["files", newData.category],
                (oldData: { files: IFile[] }) => {
                    const uploadedFile = newData.file;
                    const oldFile = oldData.files || [];

                    const newMergeFiles = [uploadedFile, ...oldFile];

                    const updatedData = { ...oldData, files: newMergeFiles };

                    return updatedData;
                }
            );

            toast(newData?.message, {
                description: newData?.description,
            });
        },
        onError: (c) => {
            toast(c.name, {
                description: c.message,
            });
        },
        onSettled: () => {
            setIsUploading(false);
        },
    })
    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || [])

        if (!files.length) {
            toast('No time selected', {
                description: "Please select a file to upload"
            })
            return
        }

        const progressMap: Record<string, number> = {}

        files.forEach((file) => {
            progressMap[file.name] = 0;
        })

        setFileProgress(progressMap);

        setIsUploading(true);

        await Promise.all(files.map((file) => mutation.mutateAsync(file)));

        e.target.value = "";

    }
    return (
        <>
            <Button onClick={() => {
                document.getElementById("file-upload")
                    ?.click()
            }}>
                <RiFileAddFill /> Upload
            </Button>
            <input type="file" className="hidden" id="file-upload" multiple onChange={handleFileChange} />
        </>
    )
}

export default UploadButton