
import minimisePayments from "@/lib/algo";
import React from "react";
import { PrismaClient } from "@prisma/client";
// import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
const client = new PrismaClient();
/*
{ title: "Nachos", amount: 300.00, by: "Ayush", balance: [{ "Ayush": -100 }, { "Dawg": -100 }, { "Babla": -100 }] }
            , { title: "NAcho", amount: 300.00, by: "Ayush", balance: [{ "Ayush": -100 }, { "Dawg": -100 }, { "Babla": -100 }] }
            , { title: "ChoCHo", amount: 300.00, by: "Ayush", balance: [{ "Ayush": -100 }, { "Dawg": -100 }, { "Babla": -100 }] }
            , { title: "cho", amount: 300.00, by: "Ayush", balance: [{ "Ayush": -100 }, { "Dawg": -100 }, { "Babla": -100 }] }
*/

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = (await params)

    try {
        // const session = await getServerSession();
        // if (!session) throw "Not allowed pupp"

        const spliddy = await client.spliddies.findFirst({
            where: {
                id: id
            }
        })

        if (spliddy) {
            //if (spliddy.authorEmail != session.user?.email) throw "Not Allowed"
            const dummyData = spliddy.data;
            const total = dummyData.expenses.reduce((acc, txn) => {
                txn.balance.map((obj) => {
                    const { name, due } = obj;
                    acc[name] = (acc[name] | 0) + due;
                })
                acc[txn.by] = (acc[txn.by] | 0) + txn.amount;
                return acc;
            }, {} as Record<string, number>);

            const totalArr = Object.entries(total).map(([n, v]) => {
                return {
                    first: n,
                    second: v
                }
            })
            const payments = minimisePayments(totalArr);
            return (
                <div className="min-h-200 min-w-200 h-lvh w-lvw bg-white flex flex-col p-8 gap-10">
                    <div className="w-full h-fit  ">
                        <h1 className="text-ourPurple text-3xl">{spliddy.title}</h1>
                        <p>-Created by Spliddy</p>
                    </div>
                    <div className="w-full flex ">

                        <table className="text-sm font-mono">
                            <thead>

                                <tr className="border-b-2  border-ourPurple ">

                                    <th className=" p-2 min-w-40 text-start">
                                        Expense
                                    </th>
                                    <th className="p-2  w-20 text-center">
                                        Amount
                                    </th>
                                    <th className="p-2 w-20 text-center">
                                        By
                                    </th>
                                    {dummyData.members.map((name) => {
                                        if (name in total) return (
                                            <th key={name} colSpan={2} className=" p-2 text-center bg-lightBlue ">{name}</th>
                                        )
                                    })
                                    }
                                </tr>
                            </thead>
                            <tbody>


                                {
                                    dummyData.expenses.map((expense) =>
                                        <tr key={expense.title} className="border-t border-gray-300 text-center">
                                            <td className=" p-2 text-start">{expense.title}</td>
                                            <td className="">&#8377;{expense.amount.toFixed(2)}</td>
                                            <td className="">{expense.by}</td>
                                            {
                                                expense.balance.map((obj, index) => {
                                                    const { name, due } = obj;
                                                    return (
                                                        <React.Fragment key={index}  >
                                                            <td className=" text-green-700 w-20 text-sm bg-lightBlue">{name == expense.by ? expense.amount : ""}</td>
                                                            <td className=" text-red-700 w-20 text-sm bg-lightBlue">{due}</td>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                }
                                <tr className="border-t-2  border-ourPurple">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    {
                                        Object.values(total).map((v, index) => <td key={index} colSpan={2} className={`p-2  bg-lightBlue text-center font-bold`}>{v < 0 ? "- " : ""}&#8377;{Math.abs(v).toFixed(2)}</td>)
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col w-fit min-w-60 mt-10 border-b-2 border-ourPurple">
                        <div className="w-auto text-center border-b-2 border-ourPurple">Suggested Payments</div>
                        {
                            payments.map((e, index) => (
                                <div key={index} className="flex justify-between w-full bg-lightBlue p-1">
                                    {
                                        e.split(" ").map((word, ind) => (
                                            <p key={ind} className="text-ourPurple">{word}</p>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>


                </div>
            )
        }
    } catch (e) {
        console.log(e);
        redirect("/")
        return <div>
        </div>
    }


}
