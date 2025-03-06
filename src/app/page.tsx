import { FilledLinkedInIcon, GithubIcon, /*LinkedinIcon*/ } from '@/components/Icons';
import { SigninButton, SignupButton } from '@/components/Buttons';
import { getServerSession } from 'next-auth'
import Link from 'next/link';
import { redirect } from 'next/navigation';




export default async function Home() {
  const session = await getServerSession();
  if (session) redirect("/dashboard");
  return (
    <div className='h-screen w-screen'>
      <header className='fixed top bg-lightBlue w-screen h-[8%] shadow p-2 px-6 flex justify-between items-center'>
        <h1 className='text-3xl text-ourPurple'>Spliddy</h1>
        <div className='flex gap-8 '>
          <SigninButton />
          <SignupButton />
        </div>
      </header>


      <footer className='fixed flex justify-end gap-6 p-2   bottom-0 h-[8%] w-screen'>
        <Link href='https://github.com/M0HiT27' target="_blank" className='hover:bg-gray-300 rounded-xs  p-1 '>
          <GithubIcon />
        </Link>
        <Link href='https://www.linkedin.com/in/mohit-raghuwanshi-3646b0153/' target="_blank" className='mr-2 hover:bg-gray-300 rounded-xs'>
          {/* <LinkedinIcon></LinkedinIcon> */}
          <FilledLinkedInIcon />
        </Link>
      </footer>
    </div >
  );
}
