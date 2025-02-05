import { P } from "@/components/custom/p";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IFile } from "@/lib/database/schema/file.model"
import { formatFileSize } from "@/lib/utils";
import { format } from "date-fns";


const FileCard = ({ file }: { file: IFile }) => {

  const { name, size, createdAt, userInfo, category } = file

  const requiredName = `${name.slice(0, 16)}... ${name.split(".")[1]}`;

  const formattedFileSize = formatFileSize(size);

  return (
    <Card className="w-full max-h-60 border-none shadow-none drop-shadow-xl">
      <CardHeader>
        <div className="flex items-start gap-4 justify-between">
          <Avatar>
            <AvatarImage src={`/${category}.png`} />
            <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-end  gap-4 justify-between w-full">

            <P>{formattedFileSize}</P>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <P>{requiredName}</P>
        <P size="small" variant="muted" weight="light">
          {format(createdAt,"dd-MMM-yyyy")}
        </P>
        <P size="small" variant="muted" weight="light">
          Uploaded By: <strong>{userInfo.name}</strong>
        </P>
      </CardContent>
    </Card>
  )
}

export default FileCard