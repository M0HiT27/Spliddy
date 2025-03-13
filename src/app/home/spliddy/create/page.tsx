import SpliddyCreator from "@/components/SpliddyCreator";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Page() {
    const session = await getServerSession();
    if (!session) {
        redirect("/");
    }
    return (
        <div className="h-full w-full   flex justify-center items-center">
            <SpliddyCreator />
        </div>
    )
}