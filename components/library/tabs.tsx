import clsx from 'clsx';
import React from 'react';

interface TabProps {
  title: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabProps[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeIndex = 0, onChange, className }) => {
  return (
    <div className={clsx('tabs', className)}>
      <div className="flex space-x-2">
        {tabs.map((tab, index) => (
          <a
            key={tab.title}
            className={clsx('tab-bordered tab', index === activeIndex && 'tab-active')}
            onClick={() => onChange?.(index)}
          >
            {tab.title}
          </a>
        ))}
      </div>
      <div className="p-4">{tabs[activeIndex] && tabs[activeIndex].content}</div>
    </div>
  );
};

export default Tabs;
