import { verify } from 'jsonwebtoken';
import React from 'react';
import { verifyWithCredentials } from '../api/auth/register/route';

const VerifyPage = async ({ searchParams: { token } }) => {
  const res = await verifyWithCredentials(token);
  return (
    <h1 style={{ color: 'green', fontWeight: 'bold', fontSize: '50px' }}>
      {res?.msg}
    </h1>
  );
};

export default VerifyPage;
