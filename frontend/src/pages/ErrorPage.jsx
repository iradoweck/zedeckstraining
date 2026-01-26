import { useRouteError, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <PublicLayout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 text-red-500">
                    <AlertTriangle size={48} />
                </div>
                <h1 className="text-4xl font-bold font-heading mb-4 text-gray-900 dark:text-white">Oops! Something went wrong.</h1>
                <p className="text-gray-500 max-w-md mb-8">
                    An unexpected error has occurred. We apologize for the inconvenience.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-8 text-left max-w-lg w-full overflow-auto text-sm font-mono text-red-600 dark:text-red-400">
                    {error.statusText || error.message}
                </div>
                <Link to="/">
                    <Button>Return to Home</Button>
                </Link>
            </div>
        </PublicLayout>
    );
}
