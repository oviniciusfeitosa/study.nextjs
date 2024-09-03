'use client';
import CardWrapper from "@/components/auth/card-wrapper";
import { FormError } from "@/components/auth/form-error";
import Link from 'next/link';

export default function NotFound() {


  return (
    <div className="xl:w-1/4 md:w-1/2 w-full px-10 sm:px-0">
    <CardWrapper
      headerLabel=""
      title="Not Found"
      backButtonHref="/"
      backButtonLabel="Return"
    >
          <FormError message={"Could not find requested resource"} />
    </CardWrapper>
    </div>
  );

  return (
    <div>
      <h2 className='text-3xl'>Not Found</h2>
      <p></p>
      <Link href="/">Return Home</Link>
    </div>
  );
}





