import { useEffect, useState } from 'react';
// Assuming you have a CSS file for homepage-specific styles

function BlastPage() {
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        // Simulating fetching user's name
        // In a real-world app, you might fetch this data from your backend
        fetch('/showdata')
            .then(response => response.json())
            .then(data => {
                if (data.data.length > 0) {
                    // Assuming the first user is the current user
                    setUserName(data.data[0].name);
                }
            })
            .catch(error => console.error('Fetching user data failed:', error));
    }, []);

    return (
        <div className="p-8">
            {userName && <h2 className="text-xl font-semibold mb-4">Welcome, {userName}!</h2>}
            <h1 className="text-3xl font-bold mb-6">BLAST Analysis</h1>
            {/* Your form and button */}
            <div className="mb-4">
                {/* Your inputs and the rest of the form */}
            </div>
            <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Run BLAST
            </button>
        </div>
    );
}

export default BlastPage;
