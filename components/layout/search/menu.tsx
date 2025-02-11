import clsx from 'clsx';
import { Suspense } from 'react';

import MenuSectionTitle from 'components/menus/menuSectionTitle';
import { getCollections } from 'lib/shopify';
import FilterList from './filter';

function ListWrapper({ children }: { children: React.ReactNode }) {
  return <div className="pb-12">{children}</div>;
}

function DesignList() {
  return (
    <ListWrapper>
      <FilterList
        list={[
          { title: 'Trending', path: '/designs/trending' },
          { title: 'Ready to Ship', path: '/designs/ready-to-ship' },
          { title: 'Categories', path: '/designs/categories' }
        ]}
        title={<MenuSectionTitle iconPath="/icons/community.svg" text="Community Designs" />}
      />
    </ListWrapper>
  );
}

async function CollectionList() {
  const collections = await getCollections();
  return (
    <ListWrapper>
      <FilterList
        list={collections}
        title={<MenuSectionTitle iconPath={'/icons/paint_brush.svg'} text="Create Your Own" />}
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
