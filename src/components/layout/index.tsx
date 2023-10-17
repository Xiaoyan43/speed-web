'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import LogoImg from '@/app/favicon.ico';
import { getSideMenu, topMenuConfig } from '@/routes';
import SideMenu from '../menu/side-menu';
import TopMenu from '../menu/top-menu';
import LoginBtn from '../user/LoginBtn';
import styles from './styles.module.scss';

type LayoutProps = {
  token?: string;
  userInfo?: any;
  allowVisitor?: boolean;
  needRole?: any;
  realRole?: any;
  children: React.ReactNode;
};

const Layout = ({ token, userInfo, allowVisitor, needRole, realRole, children }: LayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameArr = pathname?.split('/');
  const items = getSideMenu(pathnameArr[1]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftArea}>
          <Image src={LogoImg} alt="logo" className={styles.logo} onClick={() => router.push('/')} />
        </div>
        <div className={styles.contentArea}>
          <TopMenu items={topMenuConfig} />
        </div>
        <div className={styles.rightArea}>
          <LoginBtn token={token} userInfo={userInfo} />
        </div>
      </header>
      <div className={styles.main}>
        {items?.length > 0 && (
          <div className={styles.leftArea}>
            <SideMenu items={items} />
          </div>
        )}
        {(allowVisitor || token || pathname === '/') && needRole == realRole ? (
          <div className={styles.contentArea}>{children}</div>
        ) : (
          <div className={styles.notAllow}>No permission to access, please login first Or switch Account</div>
        )}
      </div>
    </>
  );
};

export default Layout;
