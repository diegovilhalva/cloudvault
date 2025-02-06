"use server"

import { TRenameFileForm, TShareFileForm } from "@/app/(dashboard)/_components/file-card/menu";
import { FIVE_MINUTES } from "@/lib/constants";
import db from "@/lib/database/db";
import { File, IFile } from "@/lib/database/schema/file.model";
import { pinata } from "@/lib/pinata/config";
import { ActionResponse, parseError } from "@/lib/utils";

export async function generateUrl(cid: string) {
    try {
        const url = pinata.gateways.createSignedURL({
            cid,
            expires: FIVE_MINUTES
        })
        return { data: url, status: 201 }
    } catch (error) {
        console.log("Error in generating files: ", error);
        const err = parseError(error);

        return { data: `${err}`, status: 500 };
    }
}

export async function deleteFile(file: IFile) {
    await db()

    const { pinataId, category, _id } = file

    await pinata.files.delete([pinataId])
    await File.deleteOne({ pinataId })

    return { status: 200, category, fileId: _id }
}

export async function updateFilePermissions(file: IFile, values: TShareFileForm) {
    try {
        await db()
        const { pinataId } = file
        const newPermission = {
            email: values.email,
            permissions: values.permissions
        }

        const dbFiles = (await File.findOne({ pinataId })) as IFile
        const { sharedWith } = dbFiles

        const allPermission = sharedWith.filter(({ email }) => email !== values.email)

        const permissionToSave = [...allPermission, newPermission]

        await File.updateOne({ pinataId }, {
            $set: {
                sharedWith: permissionToSave
            }
        })
        return {
            message: `Shared with ${values.email}`,
            description: `${values.permissions}`,
            status: 200,
        }
    } catch (error) {
        console.log("Error in updating files: ", error);

        const err = parseError(error);

        return {
            message: "Error",
            description: err,
            status: 500,
        };
    }
}

export async function renameFile({ file, values }: { file: IFile, values: TRenameFileForm }) {
    try {
        await db()
        const { pinataId } = file
        const { name } = values

        const updatedFile = await File.findOneAndUpdate(
            { pinataId },
            { name },
            {new:true}
        )

        return ActionResponse({
            message: "Rename Successful",
            description: `New name: ${name}`,
            status: 200,
            file: updatedFile,
        })
    } catch (error) {
        console.log("Error in renaming file: ", error);
        const err = parseError(error);
    
        return ActionResponse({
          message: "Error",
          description: `${err}`,
          status: 500,
          file: null,
        });
    }
}