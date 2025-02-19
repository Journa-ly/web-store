import clsx from 'clsx';
import { Suspense } from 'react';

import MenuSectionTitle from 'components/menus/menuSectionTitle';
import { getCollections } from 'lib/shopify';
import FilterList from './filter';

const CommunityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.0002 10.8001C13.9884 10.8001 15.6002 9.18832 15.6002 7.2001C15.6002 5.21187 13.9884 3.6001 12.0002 3.6001C10.012 3.6001 8.40019 5.21187 8.40019 7.2001C8.40019 9.18832 10.012 10.8001 12.0002 10.8001Z"
      fill="#1F2937"
    />
    <path
      d="M7.20019 9.6001C7.20019 10.9256 6.12568 12.0001 4.8002 12.0001C3.47471 12.0001 2.4002 10.9256 2.4002 9.6001C2.4002 8.27461 3.47471 7.2001 4.8002 7.2001C6.12568 7.2001 7.20019 8.27461 7.20019 9.6001Z"
      fill="#1F2937"
    />
    <path
      d="M1.78897 18.3909C1.58547 18.2726 1.42845 18.0863 1.35916 17.8613C1.25582 17.5258 1.2002 17.1695 1.2002 16.8001C1.2002 14.8119 2.81197 13.2001 4.8002 13.2001C5.4266 13.2001 6.01564 13.3601 6.52867 13.6414C5.27214 14.8787 4.43316 16.5391 4.24194 18.3921C4.21436 18.6594 4.22587 18.9231 4.27215 19.1772C3.37293 19.0988 2.53053 18.822 1.78897 18.3909Z"
      fill="#1F2937"
    />
    <path
      d="M19.7288 19.1771C20.6278 19.0987 21.47 18.8219 22.2114 18.3909C22.4149 18.2726 22.5719 18.0863 22.6412 17.8613C22.7446 17.5258 22.8002 17.1695 22.8002 16.8001C22.8002 14.8119 21.1884 13.2001 19.2002 13.2001C18.5739 13.2001 17.985 13.36 17.472 13.6412C18.7287 14.8786 19.5677 16.539 19.759 18.3922C19.7865 18.6594 19.775 18.9231 19.7288 19.1771Z"
      fill="#1F2937"
    />
    <path
      d="M21.6002 9.6001C21.6002 10.9256 20.5257 12.0001 19.2002 12.0001C17.8747 12.0001 16.8002 10.9256 16.8002 9.6001C16.8002 8.27461 17.8747 7.2001 19.2002 7.2001C20.5257 7.2001 21.6002 8.27461 21.6002 9.6001Z"
      fill="#1F2937"
    />
    <path
      d="M6.3648 19.4292C6.12587 19.2129 5.99926 18.8975 6.03234 18.5769C6.34408 15.556 8.89709 13.2001 12.0004 13.2001C15.1036 13.2001 17.6567 15.5561 17.9684 18.5769C18.0015 18.8975 17.8749 19.2129 17.6359 19.4292C16.1456 20.7783 14.169 21.6001 12.0004 21.6001C9.83177 21.6001 7.8551 20.7783 6.3648 19.4292Z"
      fill="#1F2937"
    />
  </svg>
);

const PaintBrushIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.5986 1.5C20.2232 1.5 19.8562 1.61111 19.5439 1.81934L14.4649 5.20533C13.1853 6.05835 12.0203 7.0624 10.993 8.19218C13.1064 9.18391 14.8161 10.8935 15.8078 13.007C16.9376 11.9797 17.9416 10.8146 18.7946 9.53508L22.1806 4.45609C22.3888 4.14375 22.5 3.77677 22.5 3.40139C22.5 2.35128 21.6487 1.5 20.5986 1.5ZM12.2995 15.5249C12.9568 15.1597 13.5898 14.7563 14.1954 14.3175C13.3836 12.258 11.742 10.6164 9.68246 9.80456C9.24361 10.4102 8.84023 11.0432 8.47506 11.7005L8.19653 12.2018C9.93302 12.6985 11.3015 14.0669 11.7981 15.8034L12.2995 15.5249ZM6.74995 13.5C4.67886 13.5 2.99995 15.1789 2.99995 17.25C2.99995 18.0784 2.32839 18.75 1.49995 18.75C1.46599 18.75 1.43219 18.7489 1.3986 18.7466C1.12245 18.7284 0.858681 18.8637 0.712418 19.0986C0.566154 19.3336 0.561166 19.63 0.699441 19.8697C1.60524 21.4402 3.30337 22.5 5.24995 22.5C8.14946 22.5 10.5 20.1495 10.5 17.25C10.5 15.1789 8.82104 13.5 6.74995 13.5Z"
      fill="#1F2937"
    />
  </svg>
);

function ListWrapper({ children }: { children: React.ReactNode }) {
  return <div className="pb-12">{children}</div>;
}

function DesignList() {
  return (
    <ListWrapper>
      <FilterList
        list={[
          { title: 'Trending', path: '/designs/trending' },
          { title: 'Ready to Ship', path: '/collections/ready-to-ship' },
          { title: 'Categories', path: '/designs/categories' }
        ]}
        title={<MenuSectionTitle Icon={CommunityIcon} text="Community Designs" />}
      />
    </ListWrapper>
  );
}

async function CollectionList() {
  const collections = await getCollections();

  // Filter out the ready-to-ship collection
  const filteredCollections = collections.filter(
    (collection) => collection.handle.toLowerCase() !== 'ready-to-ship'
  );

  return (
    <ListWrapper>
      <FilterList
        list={filteredCollections}
        title={<MenuSectionTitle Icon={PaintBrushIcon} text="Create Your Own" />}
      />
    </ListWrapper>
  );
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
const activeAndTitles = 'bg-neutral-800';
const items = 'bg-neutral-400';

export default function Menu() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <div className="order-first h-full w-full flex-none rounded-lg px-4 pt-12 shadow-xl md:max-w-[300px]">
        <DesignList />
        <CollectionList />
        {/* <Search /> */}
      </div>
    </Suspense>
  );
}
