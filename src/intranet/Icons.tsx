import React from 'react';

const paths: Record<string, string> = {
  home: 'M3 10 12 3l9 7M5 9v12h14V9M9 21v-8h6v8',
  courses: 'M4 4h7v16H4zM14 4h6v16h-6zM7 7h1M17 7h1',
  calendar: 'M4 5h16v16H4zM7 3v4M17 3v4M4 10h16M8 14h1M14 14h1M8 17h1',
  grades: 'M5 3h14v18H5zM8 7h8M8 11h8M8 15h4',
  tasks: 'M9 4h6v3H9zM9 5H5v16h14V5h-4M8 12l2 2 5-5',
  news: 'M4 5h16v15H4zM7 8h10M7 12h10M7 16h6',
  students:
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M2 21v-2a7 7 0 0 1 14 0v2M17 4a4 4 0 0 1 0 7M20 21v-2a7 7 0 0 0-3-5',
  contact: 'M3 5h18v14H3zM3 6l9 7 9-7',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'M5 12l4 4L19 6',
};

export const Icon: React.FC<{ name: string }> = ({ name }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.home} />
    </svg>
  );
};
