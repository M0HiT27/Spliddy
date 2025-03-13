import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getServerSession } from "next-auth";



export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json(
            { msg: "Not authorised" },
            { status: 401 },
        )
    }
    const data = await req.json();
    console.log(data);
    try {
        const id = data.id || "67cf6305df67f91832565641"; // Example ID (this can be dynamic)

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/spliddy-preview/${id}`;
        console.log(url);
        await page.goto(url, { waitUntil: "networkidle0" });

        const pdf = await page.pdf({ format: "a4", printBackground: true });

        await browser.close();

        return new NextResponse(pdf, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=invoice.pdf",
            },
        });
    } catch (error) {
        console.log(error + "error");
        return new Response(JSON.stringify({ error: "error" }), { status: 500 });
    }
}
