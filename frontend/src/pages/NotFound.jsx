import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <PublicLayout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <FileQuestion size={48} />
                </div>
                <h1 className="text-4xl font-bold font-heading mb-4 text-gray-900 dark:text-white">Page Not Found</h1>
                <p className="text-gray-500 max-w-md mb-8">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
                </p>
                <Link to="/">
                    <Button>Back to Home</Button>
                </Link>
            </div>
        </PublicLayout>
    );
}
