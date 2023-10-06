import { SignUp } from '@clerk/nextjs';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function SignUpPage() {
  
  return (
    <MaxWidthWrapper className="max-w-5xl">
      <div className='flex items-center justify-center w-full h-screen bg-white dark:bg-black'>
        <SignUp />
      </div>
    </MaxWidthWrapper>
  )
}
