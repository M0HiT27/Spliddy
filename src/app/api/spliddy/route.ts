import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { spliddyData } from "@prisma/client";

import { PrismaClient } from "@prisma/client";
const client = new PrismaClient;

export async function GET(req: NextRequest) {
    console.log(req);
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json(
            { msg: "Not authorised" },
            { status: 401 },
        )
    }
    try {
        if (session.user == null || session.user.email == null) throw "err";
        const email: string = session.user.email;
        const spliddies = await client.spliddies.findMany({
            where: {
                authorEmail: email
            }
        })
        if (spliddies) {
            return NextResponse.json({
                spliddies: spliddies,
                status: 200
            })
        } throw "spliddies not found"

    } catch (e) {
        console.log(e)
        return NextResponse.json(
            { msg: "something went wrong" },
            { status: 500, }
        )
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    console.log(session);
    if (!session) {
        return NextResponse.json(
            { msg: "Not authorised" },
            { status: 401 },
        )
    } console.log("post endpoint reached");
    const data = await req.json();
    console.log(data);
    try {
        if (session.user == null || session.user.email == null || (!req) || (!req.body)) throw "err";
        const email: string = session.user?.email;
        const spliddy: spliddyData = data.spliddy;
        const title: string = data.title;
        console.log(spliddy);
        const user = await client.user.findFirst({
            where: {
                email: email
            }
        })
        if (user) {

            const newspliddy = await client.spliddies.create({
                data: {
                    authorEmail: email,
                    author: user.id,
                    title: title,
                    data: spliddy
                }
            })
            if (newspliddy) {
                const id = newspliddy.id;
                return NextResponse.json(
                    id,
                    { status: 200 }
                )
            }
        }
        throw "burra"

    } catch (e) {
        console.log(e);
        return NextResponse.json(
            { msg: "something went wrong" },
            { status: 500 },
        )
    }
}
export async function PUT(req: NextRequest) {
    const session = await getServerSession();
    console.log(session);
    if (!session) {
        return NextResponse.json(
            { msg: "Not authorised" },
            { status: 401 },
        )
    }
    const data = await req.json();
    try {
        const spliddy = await client.spliddies.findFirst({
            where: {
                id: data.id
            }
        })
        if (spliddy && spliddy.authorEmail == session.user?.email) {
            const updation = await client.spliddies.update({
                where: {
                    id: spliddy.id
                },
                data: {
                    data: data.updateData
                }
            })
            if (updation) {
                return NextResponse.json({
                    msg: "Spliddy Successfully updated.."
                })
            }

        } throw "Spliddy not found"
    } catch (e) {
        console.log(e)
        return NextResponse.json({ msg: "Unauthorised" }, { status: 401 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession();
    console.log(session);
    if (!session) {
        return NextResponse.json(
            { msg: "Not authorised" },
            { status: 401 },
        )
    }
    const data = await req.json();
    try {
        const spliddy = await client.spliddies.findFirst({
            where: {
                id: data.id
            }
        })
        if (spliddy && spliddy.authorEmail == session.user?.email) {
            const deletion = await client.spliddies.delete({
                where: {
                    id: spliddy.id
                }
            })
            if (deletion) {
                return NextResponse.json({
                    msg: "Spliddy Successfully deleted.."
                })
            }

        } throw "Spliddy not found"
    } catch (e) {
        console.log(e)
        return NextResponse.json({ msg: "Unauthorised" }, { status: 401 });
    }
}