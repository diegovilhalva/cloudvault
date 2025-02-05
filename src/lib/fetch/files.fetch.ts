import axios from "axios"

export async function getFiles({ page, currentPage }: { page: string, currentPage: number }) {
    if (page === "subscription") {
        return { files: [] }
    }

    const res = await axios.get(`/api/v1/files/${page}`, {
        params: {
            page: currentPage
        }
    })

    return res.status === 200 ? res.data.data : { files: [] }
}