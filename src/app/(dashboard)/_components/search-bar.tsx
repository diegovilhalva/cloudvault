"use client"

import { generateUrl } from "@/action/file.action"
import { P } from "@/components/custom/p"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSidebar } from "@/components/ui/sidebar"
import { IFile } from "@/lib/database/schema/file.model"
import { searchFiles } from "@/lib/fetch/files.fetch"
import { cn, dynamicDownload } from "@/lib/utils"
import { RiArrowRightFill, RiFileDownloadFill, RiLoader3Fill, RiSearch2Fill } from "@remixicon/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { toast } from "sonner"

const SearchBar = () => {
  const { state } = useSidebar()
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)

  const handleDialogOpen = () => {
    setIsSearchDialogOpen(true)
  }

  return (
    <>
      {
        state === "expanded" && (
          <div className="flex items-center justify-between w-full px-4 py-2 bg-transparent border border-border rounded-md hover:bg-accent hover:text-foreground transition-all ease-in-out duration-200 cursor-pointer" onClick={handleDialogOpen}>
            <div className="flex items-center justify-start gap-3">
              <RiSearch2Fill />
              <span>Quick search...</span>
            </div>
            <RiArrowRightFill />
          </div>
        )
      }
      {state === "collapsed" && (
        <Button variant="ghost" size="icon" onClick={handleDialogOpen}>
          <RiSearch2Fill />
        </Button>
      )}
      <SearchDialog isSearchDialogOpen={isSearchDialogOpen} 
      setIsSearchDialogOpen={setIsSearchDialogOpen} />
    </>
  )
}

const SearchDialog = ({
  isSearchDialogOpen,
  setIsSearchDialogOpen,
}: {
  isSearchDialogOpen: boolean;
  setIsSearchDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: searchFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search", searchTerm] });
    },
    onError: (error) => {
      toast(error.name, {
        description: error.message,
      });
    },
    onSettled: () => {
      setIsSearching(false);
    },
  });

  useQuery({
    queryKey: ["search", searchTerm],
    queryFn: () => searchFiles(searchTerm),
    enabled: !!searchTerm,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      mutation.mutateAsync(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (!value) return;

    setSearchTerm(value);
  }

  return (
    <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle>title</DialogTitle>
          <DialogDescription>des</DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex items-center justify-start gap-3">
            <RiSearch2Fill />
            <Input
              className="input"
              placeholder="Search here..."
              onChange={handleChange}
            />

            {isSearching && <RiLoader3Fill className="animate-spin" />}
          </div>

          <div className={cn("space-y-3", mutation.data && "mt-4")}>
            {mutation.data &&
              mutation.data.length > 0 &&
              mutation.data.map((file: IFile) => (
                <SearchDisplayCard file={file} key={file._id} />
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const SearchDisplayCard = ({ file }: { file: IFile }) => {
  const [isLinkInProgress, setIsLinkInProgress] = useState(false);

  const {
    name,
    category,
    createdAt,
    userInfo: { name: userName },
  } = file;

  const requiredName = `${name.slice(0, 16)}... ${name.split(".")[1]}`;

  return (
    <Card className="shadow-none drop-shadow-xl">
      <CardContent className="py-4">
        <div className="flex w-full h-fit gap-4 items-center justify-between">
          <div className="flex w-full h-fit gap-4">
            <Avatar className="size-12 rounded-none">
              <AvatarImage src={`/${category}.png`} />
              <AvatarFallback>{"CP"}</AvatarFallback>
            </Avatar>

            <div>
              <P size="large" weight="bold">
                {requiredName}
              </P>

              <div>
                <P size="small" variant="muted" weight="light">
                  {format(createdAt, "dd-MMMM-yyyy")} | Uploaded By:{" "}
                  <b>{userName}</b>
                </P>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              setIsLinkInProgress(true);
              const { data, status } = await generateUrl(file.cid);

              if (status !== 201) {
                toast(`${data}`, {
                  description: data as string,
                });

                setIsLinkInProgress(false);

                return;
              }

              setIsLinkInProgress(false);

              dynamicDownload(data as string, file.name);
            }}
          >
            {!isLinkInProgress ? (
              <RiFileDownloadFill />
            ) : (
              <RiLoader3Fill className="animate-spin" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


export default SearchBar