import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = ({ label, className, error, ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            <input
                className={twMerge(
                    clsx(
                        'w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all dark:bg-gray-700 dark:text-white',
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary',
                        className
                    )
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};
