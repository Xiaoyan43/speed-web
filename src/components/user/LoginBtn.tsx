'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import { clearCookies } from '@/app/action';

export default function Component({ token, userInfo = {} }: any) {
  const router = useRouter();

  const signIn = () => {
    router.push('/login');
  };

  const signOut = () => {
    clearCookies();
    router.push('/login');
  };

  if (token) {
    return (
      <>
        <span>{userInfo}</span>
        <Button style={{ color: 'rgb(244, 142, 142)' }} type="link" onClick={() => signOut()}>
          SignOut
        </Button>
      </>
    );
  }

  return (
    <Button style={{ color: '#1da57a' }} type="link" onClick={() => signIn()}>
      LogIn
    </Button>
  );
}
