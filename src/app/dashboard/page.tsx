import { LogoutButton } from '@/components/Buttons';
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';

export default async function Dashboard() {
    const session = await getServerSession();
    if (session) {
        return (
            <div className='h-lvh w-screen'>

                <header className='fixed top-0 bg-lightBlue w-screen h-[8lvh] shadow p-2 px-6 flex justify-between items-center'>
                    <h1 className='text-3xl text-ourPurple'>Spliddy</h1>
                    <div className='flex gap-8 '>
                        <LogoutButton />
                    </div>
                </header>
            </div>
        )
    }
    redirect('/');
}