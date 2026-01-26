import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Select = React.forwardRef(({ label, error, className, options = [], ...props }, ref) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                className={twMerge(
                    clsx(
                        "block w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm px-3 py-2",
                        error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
                        className
                    )
                )}
                {...props}
            >
                <option value="" disabled selected>Select an option</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
});

Select.displayName = "Select";
