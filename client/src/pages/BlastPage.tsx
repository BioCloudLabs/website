import { useEffect, useState, FormEvent } from 'react';

function BlastPage() {
    const [userName, setUserName] = useState<string>('');
    const [sequence, setSequence] = useState<string>('');

    useEffect(() => {
        // Retrieve user information from LocalStorage
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            setUserName(`${userData.first_name} ${userData.last_name}`);
        }
    }, []);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // Simulate submitting the sequence using the ReqRes 'Create' endpoint
        fetch('https://reqres.in/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: sequence }), // For demonstration, using 'name' to store sequence
        })
        .then(response => {
            if (response.ok) {
                console.log('Sequence submitted successfully');
                setSequence(''); // Clear the textarea after submission
            } else {
                console.error('Submission failed');
            }
        })
        .catch(error => {
            console.error('Error submitting the form:', error);
        });
    };

    return (
        <div className="p-8">
            {userName && <h2 className="text-xl font-semibold mb-4">Welcome, {userName}!</h2>}
            <h1 className="text-3xl font-bold mb-6">BLAST Analysis</h1>
            {/* Form for submitting a DNA/RNA sequence */}
            <form onSubmit={handleSubmit} className="mb-4">
                <label htmlFor="sequence" className="block text-sm font-medium text-gray-700">
                    Enter your DNA/RNA sequence:
                </label>
                <br></br>
                <textarea
                    id="sequence"
                    name="sequence"
                    rows={10}
                    cols={50}
                    required
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                    value={sequence}
                    onChange={e => setSequence(e.target.value)}
                ></textarea>
                <br />
                <button
                    type="submit"
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Submit Sequence
                </button>
            </form>
            <br></br>
            {/* Existing button to run BLAST (consider integrating this with your form as needed) */}
            <button
                type="button"
                className="start-button"
            >
                Run BLAST
            </button>
        </div>
    );
}

export default BlastPage;
