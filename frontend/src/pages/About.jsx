import PublicLayout from '../components/layout/PublicLayout';

export default function About() {
    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold font-heading mb-8">About Zedeck's Training</h1>
                <div className="prose dark:prose-invert max-w-none space-y-6 text-lg text-gray-600 dark:text-gray-300">
                    <p>
                        Zedeck's Training is a premier educational platform dedicated to bridging the gap between academic learning and industry requirements.
                        Founded with a mission to empower individuals, we provide high-quality, practical training in technology, business, and creative skills.
                    </p>
                    <p>
                        Our courses are designed by industry experts who bring real-world experience into the classroom.
                        Whether you are a student looking to start your career or a professional aiming to upskill,
                        we have the right resources for you.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white pt-6">Our Mission</h2>
                    <p>
                        To provide accessible, affordable, and high-quality education that enables learners to achieve their full potential and succeed in the global economy.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
