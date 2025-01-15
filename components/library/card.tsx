import clsx from 'clsx';
import React from 'react';

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  shadow?: boolean;
}

const Card: React.FC<CardProps> = ({
  bordered = false,
  shadow = true,
  className,
  children,
  ...props
}) => {
  const classes = clsx(
    'card',
    bordered && 'card-bordered',
    shadow && 'shadow',
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
