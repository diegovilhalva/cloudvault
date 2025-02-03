import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { createAuthMiddleware } from "better-auth/api";
import client from "./db";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../env";
import db from "../database/db";
import { Subscription } from "../database/schema/subscription.model";
import { ObjectId } from "mongodb"
const dbClient = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(dbClient),
    socialProviders: {
        google: {
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        },
    },
    hooks: {
        after: createAuthMiddleware(async (c) => {
            const newSession = c.context.newSession
            const user = newSession?.user

            if (newSession && user) {
                try {
                    await db()

                    const isSubAvil = await Subscription.findOne({ subscriber: user.id })

                    if (isSubAvil) {
                        return
                    }

                    const subs = await Subscription.create({
                        subscriber: user.id,
                        status: "activated"
                    })

                    const userCollection = dbClient.collection("user")
                    await userCollection.updateOne({
                        _id: new ObjectId(subs.subscriber)
                    }, {
                        $set: { subscription: subs._id }
                    })
                } catch (error) {
                    console.log("Erro in creating subscription in auth before hook: ",error)

                    throw c.redirect("/sign-in")
                }
            }
        })
    },
    plugins: [nextCookies()]
})