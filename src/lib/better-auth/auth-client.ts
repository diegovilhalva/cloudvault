import { createAuthClient } from "better-auth/react"
import { BASE_URL } from "../env"

export const authClient = createAuthClient({
    baseURL: BASE_URL
})


export const { useSession,signOut } = authClient