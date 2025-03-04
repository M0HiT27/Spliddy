import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

import { z } from 'zod';
const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be atleast 8 charcters").max(20, "Password must be atmost 20 characters")
})
export const authOptions = {
    providers: [
        CredentialsProvider(
            {

                credentials: {
                    email: { label: 'email', type: 'text', placeholder: '' },
                    password: { label: 'password', type: 'password', placeholder: '' },
                },
                async authorize(credentials, req) {
                    console.log('sigin request aayi');
                    const userData = {
                        email: credentials?.email,
                        password: credentials?.password,

                    }
                    try {
                        const parsedData = signinSchema.parse(userData);
                        const user = await client.user.findFirst({
                            where: {
                                email: parsedData.email
                            }
                        })
                        if (user) {
                            const passwordMatch = await bcrypt.compare(parsedData.password, user.password);
                            if (passwordMatch) {
                                const jwtSecret = process.env.JWT_SECRET;
                                const token = jwt.sign({ userID: user.id }, jwtSecret as string);
                                return {
                                    name: user.name,
                                    id: user.id,
                                    email: user.email,
                                    token: token
                                }
                            }
                        } return null;

                    } catch (e) {
                        console.log(e);
                    }
                    return null;

                }
            }
        )
    ],
    pages: {
        signIn: '/signin'
    },
    secret: process.env.NEXTAUTH_SECRET
}