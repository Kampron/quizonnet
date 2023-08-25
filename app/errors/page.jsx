import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
const Errors = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errMsg = searchParams.get('error');
  return (
    <div>
      <h1 color="red.500">Errors: {errMsg}</h1>
      <button onClick={() => router.back()}>Try Again</button>
    </div>
  );
};

export default Errors;
