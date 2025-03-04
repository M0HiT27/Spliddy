import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

import bcrypt from "bcrypt";

import { z } from "zod";
const signupSchema = z.object({
    name: z.string().min(3, "Name must be of at least 3 characters").max(20, "Name must be of at most 20 characters"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be of at least 8 characters").max(20, "Password must be of at most 20 charcters")
})

export async function POST(req: NextRequest) {
    // const {email , name , password} = req.body ;
    console.log("signup requested ...")
    const data = await req.json();
    try {
        const User = signupSchema.parse(data);
        const hashedPassword = await bcrypt.hash(User.password, 5);
        const user = await client.user.create({
            data: {
                name: User.name,
                password: hashedPassword,
                email: User.email,

            }
        })
        if (user) {
            return NextResponse.json(
                { message: "Signup successful" },
                { status: 200 },
            )
        }
    } catch (e) {
        console.log(e);
        return NextResponse.json(
            { message: "Invalid Credentials" },
            { status: 400 }
        )
    }
}