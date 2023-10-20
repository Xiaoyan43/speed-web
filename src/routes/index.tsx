import {HomeOutlined, WifiOutlined, SmileOutlined, SettingFilled, InfoCircleOutlined} from '@ant-design/icons';
import { getTitles, matchPath, treeForeach } from './utils';

const config: any['items'] = [
  {
    label: 'HOME',
    key: '',
    icon: <HomeOutlined />,
  },
  {
    label: 'EXAMINE',
    key: 'examine',
    icon: <SettingFilled />,
  },
  {
    label: 'ANALYZE',
    key: 'analyze',
    icon: <InfoCircleOutlined />,
  },
];

const topMenuConfig = config?.map((item: any) => {
  const { children, ...other } = item;
  return other;
});

const getSideMenu = (key: string) => {
  const newConfig = config?.find((item: any) => item.key === key)?.children || [];
  return treeForeach(newConfig, [key]);
};

const getRouteTitle = (pathname: string) => {
  const titles = getTitles(config);
  let title = '';
  for (const key in titles) {
    if (matchPath(key, pathname)) {
      title = titles[key];
      break;
    }
  }
  return title;
};

export { topMenuConfig, getSideMenu, getRouteTitle };
