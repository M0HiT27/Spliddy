"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import { DeleteIcon, TickIcon } from "./Icons";
import MessagePopup from "./MessagePopup";
import { roundToDecimal } from "@/lib/algo";
import { Spliddies, spliddyBalance, spliddyExpense } from "@prisma/client";
import axios, { AxiosError } from "axios";


export default function SpliddyCreator({ props }: { props?: Spliddies }) {

    // const [names, setNames] = useState<string[]>([]);
    const router = useRouter();
    const [errorState, setErrorState] = useState<string>("");
    const isErrorRef = useRef<boolean>(true);
    function errorMaker(errorMessage: string) {
        // console.log("errorMaker called with " + errorMessage);
        isErrorRef.current = true;
        setErrorState(errorMessage);
    }

    function successMaker(message: string) {
        isErrorRef.current = false;
        setErrorState(message);
    }
    const [expenses, setExpenses] = useState<spliddyExpense[]>([]);
    const [selected, setSelected] = useState<"Overview" | "Expenses" | "Add Expense">("Overview");
    const nameRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const byRef = useRef<HTMLSelectElement>(null);
    // const generateButtonRef = useRef<HTMLButtonElement>(null);
    const [expenseAmount, setExpenseAmount] = useState<number>(0.0);
    const [participant, setParticipant] = useState<Record<string, number>>({})
    const [isEqSplit, setEqual] = useState(true);
    // const [deleteMode, setDeleteMode] = useState(false);
    function toggleEqual() {
        setEqual(prev => !prev)
    }
    function splitTotal(obj: Record<string, number>) {
        if (isEqSplit) {
            splitTotalEq(obj);
        } else {
            splitTotalUnequal(obj)
        }
    }
    function splitTotalUnequal(OBJ: Record<string, number>) {
        const obj = { ...OBJ };

        setParticipant(obj)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function unequalShareEdit(name: string, e: any) {
        e.preventDefault();
        const obj = { ...participant };
        obj[name] = parseFloat(e.target.share.value);
        setParticipant(obj);

    }
    function splitTotalEq(OBJ: Record<string, number>) {
        const obj = { ...OBJ };
        const n = Object.keys(obj).length;
        if (n <= 0) {
            setParticipant({});
            return;
        }
        const eachDue = roundToDecimal(expenseAmount / n, 2);
        let extra: number;
        if ((eachDue * n) > expenseAmount) {

            extra = (eachDue * n) - expenseAmount;
            extra *= -1;
        } else {
            extra = expenseAmount - (eachDue * n);
        }
        extra = roundToDecimal(extra, 2);
        Object.keys(obj).map((key) => {
            obj[key] = (eachDue + extra);
            extra = 0;
        })
        setParticipant(obj)
    }

    useEffect(() => {
        splitTotal(participant)
    }, [expenseAmount, isEqSplit]);

    function changeParticipant(name: string) {
        if (name in participant) {

            const newP = { ...participant }
            delete newP[name];
            splitTotal(newP);

        } else {

            const newP = { ...participant };
            newP[name] = 0;
            splitTotal(newP);
        }
    }

    const [balance, setBalance] = useState<Record<string, number>>({});

    async function generatePDF() {

        const id = await saveSpliddy();
        if (id == -1) {
            return;
        }
        console.log(id);
        if (!confirm("Do you want to generate the PDF?")) {

            router.push('/');
        }

        router.push('/');

        const newTab = window.open("", "_blank");

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({ id: id })

            });
            const pdfBlob = await response.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);

            if (pdfUrl && newTab) {
                newTab.location.href = pdfUrl;
            } else {
                newTab?.close();
                alert("Failed to generate PDF");
            }
        } catch (error) {
            newTab?.close();
            alert("An error occurred while generating the PDF.");
            console.error("Error generating PDF:", error);
        }



        // Open in a new tab
        // window.open(pdfUrl, "_blank");

    };

    function SubmitExpense() {
        try {

            if (!titleRef || !(titleRef.current) || !(titleRef.current.value)) {
                errorMaker("Title Empty");
                throw "Title Empty";
            }
            const titleExists = expenses.some((expense) => titleRef?.current?.value === expense.title);
            if (titleExists) {
                errorMaker("Expense title already exists...");
                throw "Expense title already exists...";
            }
            if (!byRef || !(byRef.current) || !(byRef.current.value)) {
                errorMaker("Title Empty")
                throw "Title Empty";
            }
            if (expenseAmount <= 0) {
                errorMaker("amount invalid")
                throw "Amount invalid"
            }
            let totalShare = 0;
            Object.values(participant).map((val) => totalShare += val);
            if (totalShare !== expenseAmount) {
                errorMaker("shared dont add up")
                throw "Shares do not add up"
            }
            const balance: spliddyBalance[] = Object.entries(participant).map(([k, v]) => {
                return {
                    "name": k,
                    "due": -1 * v
                }
            })
            const newExpense: spliddyExpense = {
                title: titleRef.current.value,
                amount: expenseAmount,
                balance: balance,
                by: byRef.current.value
            }
            setExpenses((prev) => [...prev, newExpense]);
            selectExpenses();
        } catch (e) {
            console.log(e);
        }
    }

    function selectOverview() {
        setSelected("Overview");
    }
    function selectExpenses() {
        setSelected("Expenses");
    }
    function selectAddExpense() {
        setSelected("Add Expense");
    }

    // function toggleDeleteMode() {
    //     setDeleteMode(!deleteMode);
    // }

    function deleteName(name: string) {
        // if (!deleteMode) return;
        const nameInExpenses = expenses.some((expense) => expense.by === name || expense.balance.some((b) => b.name === name));
        if (name in balance && balance[name] == 0 && !nameInExpenses) {
            setBalance((prev) => {
                const newbalance = { ...prev };
                delete newbalance[name]
                return newbalance;
            })
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function validateAmount(e: any) {
        e.preventDefault();
        if (!amountRef) {
            setExpenseAmount(0);
            return;
        }
        if (!amountRef.current) {
            setExpenseAmount(0);
            return;
        }
        const x = parseFloat(amountRef.current.value);
        if (typeof x === "number" && x >= 1) {
            console.log("flagged");
            const temp = roundToDecimal(x, 2);
            setExpenseAmount(temp);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function AddNames(e?: any) {
        e.preventDefault();
        try {

            if (nameRef && nameRef.current) {
                const name = nameRef.current?.value;
                name?.trim();

                if (name && !(name in balance) && name.length <= 10) {
                    //setNames([...names, name]);
                    setBalance((prev) => ({
                        ...prev,
                        [name]: 0.00
                    }))

                    nameRef.current.value = "";
                }

                return;
            }
            throw "Invalid Name"
        }
        catch (e) {
            console.log(e);
        }
    }

    function Overview() {
        return (
            <>
                <div className="flex items-center mt-4 ml-4 ">
                    <form onSubmit={(e) => { AddNames(e) }}>
                        <input maxLength={10} ref={nameRef} placeholder="Add a new Person.." className="text-md text-gray-500 font-mono font-extralight pl-2 rounded border border-gray-400">
                        </input>

                    </form>
                    {/* <button onClick={(e) => AddNames(e)} className="text-gray-500 ml-2 hover:bg-gray-400 hover:cursor-pointer border border-gray-500 rounded">
                        <PlusIcon size="size-6" />
                    </button> */}
                </div>
                <div className="h-auto  w-full flex flex-col px-4 my-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400">
                    Members
                    {
                        Object.entries(balance).map(([name, amount]) => {
                            return (
                                <div key={name} className={`border-b border-gray-400 text-md flex justify-between items-center text-gray-900 font-mono font-extralight`}>
                                    <div className="flex items-center">

                                        <button onClick={() => deleteName(name)} className="hover:cursor-pointer hover:bg-gray-400 text-red-900 mr-2">

                                            <DeleteIcon size='size-6' />
                                        </button>
                                        <p>
                                            {name}
                                        </p>
                                    </div>
                                    <div className="text-black font-bold">
                                        <p>{amount < 0 ? "-" : ""}&#8377;{Math.abs(amount).toFixed(2)}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    }
    function Expenses() {
        return (
            <div className=" min-h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-tract-transparent scrollbar-thumb-gray-500">

                <div className="grid grid-cols-3 mt-2  pl-8 items-center justify-between font-mono text-gray-700 border-b border-gray-400">
                    <p className="col-span-1  font-bold">Title:</p>
                    <p className="col-span-1 ">Paid by:</p>
                    <p className="col-span-1">Amount:</p>
                </div>
                {
                    expenses.map((expense) => {
                        return (
                            <div key={expense.title} className="grid grid-cols-3 mt-2  pl-8 items-center justify-between font-mono text-gray-700 border-b border-gray-400">
                                <p className="col-span-1 text-black font-bold">{expense.title}</p>
                                <p className="col-span-1 text-gray-700">{expense.by}</p>
                                <p className="col-span-1">{expense.amount}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    function AddExpense() {
        return (
            <div className="relative min-h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-tract-transparent scrollbar-thumb-gray-500">
                <button onClick={() => SubmitExpense()} className="absolute  bottom-10 right-5 z-10 p-2 hover:cursor-pointer  rounded-full  text-white bg-ourPurple hover:scale-[1.1]">
                    <TickIcon size="size-8"></TickIcon>
                </button>
                <div className="flex flex-col pl-8 ">
                    <div className="flex   mt-2">

                        <input ref={titleRef} maxLength={10} placeholder="title" defaultValue={titleRef?.current?.value} className="pl-2 font-mono border rounded border-gray-400 text-md">
                        </input>

                    </div>
                    <div className="flex mt-2">
                        <form onSubmit={(e) => validateAmount(e)}>

                            <input ref={amountRef} min={1} type="number" placeholder={"0.00"} className="pl-2  font-mono border rounded border-gray-400 text-md">
                            </input> : Amount : {expenseAmount}
                        </form>
                    </div>
                    <div className="mt-2 ">
                        <select ref={byRef} className="w-20 border border-gray-400 ">
                            {Object.keys(balance).map((name) => {
                                return (
                                    <option key={name} value={name} className="font-mono pl-2 bg-lightBlue border-b border-gray-400">{name}</option>
                                )
                            })}
                        </select> : By
                    </div>
                </div>
                <div className={`flex flex-col pl-8 mt-4 pr-8`}>
                    <div className="flex items-center font-mono text-md text-gray-600">
                        Split Equally :
                        <input checked={isEqSplit} onChange={() => toggleEqual()} type="checkbox" className="ml-2"></input>
                    </div>
                    <div className="flex flex-col font-mono text-md text-gray-500 ">
                        <div className="flex justify-between items-center ">
                            <p className="font-bold mt-4 text-black">Split Between:</p>
                            <p className="font-bold mt-4 text-black">Share:</p>
                        </div>
                        {
                            Object.keys(balance).map((name) => {
                                return (
                                    <div className="mt-2  flex items-center justify-between border-b border-gray-400" key={name}>
                                        <div className=" flex items-center">
                                            <input checked={name in participant} onChange={() => changeParticipant(name)} type="checkBox" className="mr-2"></input>
                                            <p>{name}</p>
                                        </div>

                                        {
                                            isEqSplit ?
                                                <p className="  text-black">{name in participant ? participant[name] : "0"}</p>
                                                :
                                                <form onSubmit={(e) => unequalShareEdit(name, e)} >

                                                    <input step={0.01} name="share" max={expenseAmount} min={0} placeholder="0.00" type={"number"} disabled={!(name in participant)} defaultValue={(name in participant) ? participant[name] : ""} className="border border-gray-400 pl-2 min-w-20"></input>
                                                </form>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
    const spliddyNameRef = useRef<HTMLInputElement>(null);
    async function saveSpliddy() {
        try {

            if (spliddyNameRef && !(spliddyNameRef.current?.value)) {

                throw ("Empty spliddy title");
            }
            if (expenses.length == 0) throw ("No expenses");
            let response;
            if (!props) {
                response = await axios.post("/api/spliddy", {

                    title: spliddyNameRef.current?.value,
                    spliddy: {
                        members: Object.keys(balance).map((b) => b),
                        expenses: expenses
                    }

                });
            } else {
                response = await axios.put('/api/spliddy', {
                    id: props.id,
                    updateData: {
                        members: Object.keys(balance).map((b) => b),
                        expenses: expenses
                    }
                })
            }
            if (response.status == 200) {
                console.log(response.data);
                successMaker("success");
                return response.data;
            } else {
                throw ("fail");

            }
        } catch (e) {
            if (e instanceof AxiosError) {
                errorMaker("invalid title");
                return -1;
            }
            errorMaker(e as string);
            return -1;
        }




    }
    async function deleteSpliddy() {
        if (!props) return;
        if (confirm("Do you want to delete this spliddy?")) {
            const res = await axios.delete('/api/spliddy', {
                params: { id: props.id }
            })
            if (res.status == 200) router.push('/');
        } return;
    }
    useEffect(() => {
        if (props) {
            console.log(props.data.expenses)
            setExpenses([...props.data.expenses]);

        }
    }, [])
    useEffect(() => {
        const copy = { ...balance };
        expenses.forEach((expense) => {
            copy[expense.by] = (copy[expense.by] ?? 0) + expense.amount;
            expense.balance.forEach((b) => {
                copy[b.name] = (copy[b.name] ?? 0) + b.due;
            });
        });
        console.log(copy);
        setBalance(copy);
    }, [expenses])
    return (
        <div className="lg:h-[90%] h-full rounded-2xl  lg:w-[60%] w-full shadow shadow-gray-400 bg-lightBlue ">
            <div className=" h-[10%] w-full border-b border-gray-400 flex items-center justify-between ">
                <div className="h-full w-full flex items-center pl-4">

                    <h2 className={`font-mono ${props && "hidden"} text-gray-900 text-xl   `}>
                        Name :
                    </h2>
                    <input ref={spliddyNameRef} disabled={(props) !== undefined} defaultValue={props?.title || spliddyNameRef?.current?.value} maxLength={15} placeholder="" className={` h-[80%] w-[40%]  pl-2 font-mono ${props ? "font-bold text-black text-xl" : "font-extralight text-gray-500 border border-gray-400"}   rounded-xl`}>
                    </input>
                </div>
                <button onClick={() => deleteSpliddy()} className={`hover:cursor-pointer hover:bg-gray-500 text-red-950 px-4 p-2 mr-4 rounded-md ${props ? 'block' : 'hidden'}`}>
                    <DeleteIcon size={"size-8"} />
                </button>
            </div>
            <div className="h-[80%] flex flex-col w-full border-b border-gray-400 ">
                <div className=" w-full flex  font-mono text-ourPurple bg-gray-400 ">
                    <button onClick={() => selectOverview()} className={`h-full w-[33%] rounded-r-xl ${selected == "Overview" && "bg-lightBlue"} hover:cursor-pointer`}>Overview</button>
                    <button onClick={() => selectExpenses()} className={`h-full w-[33%] rounded-xl ${selected == "Expenses" && "bg-lightBlue"}  hover:cursor-pointer `}>Expenses</button>
                    <button onClick={() => selectAddExpense()} className={`h-full w-[34%] rounded-l-xl ${selected == "Add Expense" && "bg-lightBlue"}  hover:cursor-pointer `}>Add Expense</button>
                </div>
                {selected == "Overview" ? <Overview /> : selected == "Expenses" ? <Expenses /> : <AddExpense />}

                <div className="flex justify-between">

                    {/* <div className="flex items-center  text-gray-500 font-mono font-extralight">
                        {deleteMode ? "Click on the person to remove" : "Remove Person :"}
                        <button onClick={() => toggleDeleteMode()} className={`ml-2 hover:bg-gray-400 hover:cursor-pointer border ${deleteMode ? "border-green-500 rounded text-green-500" : "border-red-600 rounded text-red-600"}`}>
                            {deleteMode ? <TickIcon size="size-6" /> : <DeleteIcon size="size-6" />}
                        </button>
                    </div> */}

                </div>
            </div>
            <div className="h-[10%] w-full flex items-center justify-start pl-4">

                <button onClick={() => generatePDF()} className="hover:scale-[1.1] hover:cursor-pointer bg-ourPurple text-white text-lg rounded p-2">
                    Generate Spliddy
                </button>
            </div>
            {errorState && <MessagePopup message={errorState} errorSetter={setErrorState} isError={isErrorRef.current} />}

        </div>
    )
}