import React from 'react';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => {
  const baseClasses = "flex items-center justify-center px-4 sm:px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary";
  const activeClasses = "bg-brand-primary text-white shadow-md";
  const inactiveClasses = "text-base-content-secondary hover:bg-base-300/50 hover:text-base-content";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};

export default TabButton;