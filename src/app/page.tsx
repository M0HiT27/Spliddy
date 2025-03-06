import { FilledLinkedInIcon, GithubIcon, /*LinkedinIcon*/ } from '@/components/Icons';
import { SigninButton, SignupButton } from '@/components/Buttons';
import { getServerSession } from 'next-auth'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Carousel from '@/components/Carousel';




export default async function Home() {
  const session = await getServerSession();
  if (session) redirect("/dashboard");
  return (
    <div className='h-lvh w-screen flex items-center'>
      <header className='fixed top-0 bg-lightBlue w-screen h-[8lvh] shadow p-2 px-6 flex justify-between items-center'>
        <h1 className='text-3xl  text-ourPurple'>Spliddy</h1>
        <div className='flex gap-8 '>
          <SigninButton />
          <SignupButton />
        </div>
      </header>
      <div className=' w-screen  grid grid-cols-2 p-4 -mt-40 gap-20 '>

        <div className=' m-auto flex flex-col justify-center font-mono font-extralight  md:text-4xl text-3xl  text-gray-300 text-center md:col-span-1 col-span-2  '>

          <h1 className='m-2 font-bold md:text-4xl xl:text-6xl lg:text-5xl sm:text-5xl text-3xl  text-white'>
            Expense-Sharing
          </h1>
          <h2>
            made easy
          </h2>
        </div>

        <div className=' overflow-x-clip md:col-span-1 col-span-2 flex justify-center'>
          <Carousel />
        </div>
      </div>

      <footer className='fixed flex justify-end gap-6 p-2   bottom-0 h-[8lvh] w-screen'>
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
