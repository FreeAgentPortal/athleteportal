import styles from './SideBar.module.scss';
import { navigation } from '@/data/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/state/auth';
import { useLayoutStore } from '@/state/layout';
import { useQueryClient } from '@tanstack/react-query';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useSelectedProfile } from '@/hooks/useSelectedProfile';

//make a type with children as a prop
type Props = {
  page: { title: string };
  large?: boolean;
};
const SideBar = (props: Props) => { 
  const sideBarOpen = useLayoutStore((state) => state.sideBarOpen);
  const toggleSideBar = useLayoutStore((state) => state.toggleSideBar);
  const { data: loggedInData } = useUser();
  const { selectedProfile } = useSelectedProfile();

  return (
    <div className={`${styles.container} ${props.large ? '' : styles.small}`}>
      <div className={styles.topSection}>
        <div className={styles.logoContainer}>
          {sideBarOpen && (
            <div
              className={styles.hamburger}
              onClick={() => {
                toggleSideBar();
              }}
            >
              <RxHamburgerMenu />
            </div>
          )}
          <Image
            src={selectedProfile?.profileImageUrl || '/images/logo.png'}
            width={30}
            height={50}
            className={styles.logo + ' ' + styles.saltLogo}
            style={{
              objectFit: 'contain',
            }}
            alt="logo"
          />

          <div>
            <p className={`${styles.productName}`}>Athlete Portal</p>
          </div>
        </div>

        {Object.values(
          navigation({
            user: loggedInData,
            profile: selectedProfile,
          })
        )
          .filter((i: any) => !i.hidden)
          .map((item: any) => {
            return (
              <div key={item.title} className={`${styles.group}`}>
                <h2 className={styles.header}>{item.title}</h2>
                <div className={styles.links}>
                  {item.links &&
                    Object.values(item.links)
                      .filter((i: any) => !i.hidden)
                      .map((subItem: any, indx: number) => {
                        return (
                          <Link
                            key={indx + subItem.title}
                            href={subItem.link}
                            className={`${styles.link} ${props.page.title === subItem.title && styles.active} ${subItem.pulse && styles.pulse}`}
                            onClick={() => toggleSideBar()}
                          >
                            <span className={styles.icon}>{subItem.icon}</span>
                            <span className={styles.text}>{subItem.title}</span>
                          </Link>
                        );
                      })}
                </div>
              </div>
            );
          })}
      </div>
      <div className={styles.bottomSection}>
        <p className={styles.fapText}>The Free Agent Portal</p>
        <p className={styles.versionText}>v{process.env.APP_VERSION}</p>
      </div>
    </div>
  );
};
export default SideBar;
