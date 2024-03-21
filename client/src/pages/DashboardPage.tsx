function DashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            
            {/* User Summary */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Welcome Back, [User Name]!</h2>
                <p>Here's what's happening with your BLAST projects today:</p>
            </div>
            
            {/* Recent Projects */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Project Example */}
                    <div className="p-4 border rounded-lg shadow">
                        <h3 className="font-semibold">Project A</h3>
                        <p>Status: In Progress</p>
                        <p>Sequences: 20</p>
                        <p>Last Updated: [Date]</p>
                        {/* More project info */}
                    </div>
                    {/* Repeat for other projects */}
                </div>
            </div>
            
            {/* Pending or Completed BLAST Analyses */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Your BLAST Analyses</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date Submitted
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Iterate over BLAST analyses here */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                BLAST Analysis 1
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                Completed
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                [Date]
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">View Results</a>
                            </td>
                        </tr>
                        {/* Repeat for other analyses */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DashboardPage;
