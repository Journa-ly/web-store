import { SortFilterItem } from 'lib/constants';
import { Suspense } from 'react';
import { FilterItem } from './item';

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </>
  );
}

export default function FilterList({
  list,
  title
}: {
  list: ListItem[];
  title?: React.ReactElement;
}) {
  return (
    <>
      <nav className="w-full">
        {title ? <h3 className="text-xs text-neutral-500 w-full">{title}</h3> : null}
        <ul className="w-full">
          <Suspense fallback={null}>
            <FilterItemList list={list} />
          </Suspense>
        </ul>
        {/* <ul className="md:hidden">
          <Suspense fallback={null}>
            <FilterItemDropdown list={list} />
          </Suspense>
        </ul> */}
      </nav>
    </>
  );
}
