import React from 'react';

export function Button({ color = '', children, ...props }: any) {
  return (
    <button
      className={
        `${color} flex items-center px-3 py-1.5 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-xl focus:outline-none focus:ring focus:ring-opacity-80 `
      }{...props}>
      {children}
    </button>
  );
}