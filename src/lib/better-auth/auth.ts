import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import client from "./db";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../env";
const db = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db),
    socialProviders: {
        google: {
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        },
    },
    plugins: [nextCookies()]
})