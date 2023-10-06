import Link from 'next/link';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { ArrowRightIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import { getUserByPublicId } from '@/server/db/utils';

const HomePage = async () => {
  const user = await getUserByPublicId('cku1q2q6d0000g1t6q1q2q6d0');

  console.log('cku1q2q6d0000g1t6q1q2q6d0', user);

  return (
    <>
      <MaxWidthWrapper className="flex flex-col items-center justify-center mb-12 mt-28 sm:mt-40 text-center">
        <div className="flex items-center justify-center space-x-2 px-7 py-2 mx-auto mb-4 max-w-fit rounded-full border shadow-md backdrop-blur overflow-hidden transition-all bg-white border-gray-200 hover:bg-white/50 hover:border-gray-300 dark:bg-black dark:border-gray-700 dark:hover:bg-black/50 dark:hover:border-gray-600 ">
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Quill is now public!</p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Chat with your <span className="text-blue-500 dark:text-blue-400">documents</span> in seconds.
        </h1>
        <p className="mt-5 max-w-prose sm:text-lg text-zinc-700 dark:text-slate-200">Quill allows you to have conversations with any PDF document. Simply upload your file and start asking questions right away.</p>

        <Link href="/dashboard" className={buttonVariants({ size: 'lg', className: 'mt-5' })}>
          Get started <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Link>
      </MaxWidthWrapper>

      {/* Value proposition section */}
      <div>
        <div className="relative isolate">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              style={{
                clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image src="/img/dashboard-preview.jpg" width={1364} height={866} quality={100} alt="Product preview" className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-xl ring-1 ring-gray-900/10" />
                </div>
              </div>
            </div>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              style={{
                clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
              className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl sm:text-5xl text-gray-900 dark:text-slate-50">Start chatting in minutes</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-slate-300">Chatting with your PDF files has never been easier than with Quill.</p>
          </div>
        </div>
        {/* Steps */}
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          {/* // TODO: Component ? */}
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 border-zinc-300 dark:border-slate-600">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-300">Step 1</span>
              <span className="text-xl font-semibold">Sing up for an account</span>
              <span className="mt-2 text-zinc-700 dark:text-slate-200">
                Either starting out with a free plan or choose our
                <Link href="/pricing" className="text-blue-700 underline underline-offset-2 dark:text-blue-200 ml-2">
                  pro plan
                </Link>
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 border-zinc-300 dark:border-slate-600">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-300">Step 2</span>
              <span className="text-xl font-semibold">Upload your PDF file</span>
              <span className="mt-2 text-zinc-700 dark:text-slate-200">We&apos;ll process your file and make it ready for you to chat with.</span>
            </div>
          </li>{' '}
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 border-zinc-300 dark:border-slate-600">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-300">Step 3</span>
              <span className="text-xl font-semibold">Start asking questions</span>
              <span className="mt-2 text-zinc-700 dark:text-slate-200">It&apos;s that simple. Try out Quill today - it really takes less than a minute.</span>
            </div>
          </li>
        </ol>

        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl p-2 ring-1 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4 bg-gray-900/5 ring-gray-900/10 dark:bg-gray-50/5 dark:ring-gray-50/10">
              <Image src="/img/file-upload-preview.jpg" width={1419} height={732} quality={100} alt="Uploading preview" className="rounded-md p-2 sm:p-8 md:p-20 shadow-xl ring-1 bg-white ring-gray-900/10 dark:bg-black dark:ring-gray-50/10" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
