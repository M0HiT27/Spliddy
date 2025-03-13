import SpliddyCreator from "@/components/SpliddyCreator";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


const client = new PrismaClient();
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession();

    if (!session) {
        redirect('/');
    }
    const { id } = (await params)

    const data = await client.spliddies.findFirst({
        where: {
            id: id
        }
    })
    if (!data) {
        redirect('/');
    }
    return (
        <div className="h-full w-full   flex justify-center items-center">
            <SpliddyCreator props={data} />
        </div>
    )
}