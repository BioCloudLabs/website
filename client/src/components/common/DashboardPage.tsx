import { useEffect, useState } from 'react';
import { getVirtualMachinesHistory } from './../../services/vmService'; // Ensure the path matches your project structure

interface VirtualMachineHistory {
    id: string;
    name: string;
    created_at: string;
    powered_off_at: string | null;
}

function DashboardPage() {
    const [userName, setUserName] = useState<string>('');
    const [vmHistory, setVmHistory] = useState<VirtualMachineHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);  // State to track loading status

    useEffect(() => {
        // Retrieve user information from LocalStorage
        const user = localStorage.getItem('userProfile');
        if (user) {
            const userData = JSON.parse(user);
            setUserName(`${userData.name}`);
        }

        // Fetch the history of virtual machines
        const fetchVmHistory = async () => {
            try {
                const history = await getVirtualMachinesHistory();
                setVmHistory(history.map(vm => ({
                    ...vm,
                    id: vm.id.toString(), // Convert the id to a string
                    created_at: new Date(vm.created_at).toLocaleDateString(),
                    powered_off_at: vm.powered_off_at ? new Date(vm.powered_off_at).toLocaleDateString() : null
                })));
            } catch (error) {
                console.error("Error fetching VM history:", error);
            } finally {
                setLoading(false);  // Set loading to false regardless of the outcome
            }
        };

        fetchVmHistory();
    }, []);

    return (
        <div className="p-8">
            {userName ? (
                <h2 className="text-3xl font-bold pt-4 my-12">Welcome back, {userName}!</h2>
            ) : (
                <h2 className="text-3xl font-bold pt-4 my-12">Welcome to BioCloudLabs!</h2>
            )}

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Your Virtual Machines History</h2>
                <table className="min-w-full divide-y divide-gray-200 pt-4 my-12">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                VM Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Powered Off At
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center">
                                    Loading virtual machines history...
                                </td>
                            </tr>
                        ) : vmHistory.length > 0 ? (
                            vmHistory.map((vm) => (
                                <tr key={vm.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {vm.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {vm.created_at}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {vm.powered_off_at || "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                                    No virtual machines have been launched yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>



            {/* Shortcut section at the dashboard page */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a href="/vm-request">
                <div className="flex flex-col items-center w-full md:w-1/3 p-5 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <div className="h-12 w-12 mb-3">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 10V13H17V10H14V8H17V5H19V8H22V10H19ZM6 19C4.89 19 4 18.1 4 17V9C4 7.89 4.89 7 6 7H11V9H6V17H18V9H13V7H18C19.1 7 20 7.89 20 9V17C20 18.1 19.1 19 18 19H6Z" fill="#4A5568" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-center">Request VM</h3>
                    <p className="text-sm text-gray-600 text-center px-3">Start a new virtual machine tailored to your needs.</p>
                </div>
            </a>
            <a href="/credits-offers">

                <div className="flex flex-col items-center w-full md:w-1/3 p-5 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <div className="h-12 w-12 mb-3">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 8H3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm0 8H3v-6h18v6zm-1-5H4v2h16v-2z" fill="#48BB78" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-center">Add Credits</h3>
                    <p className="text-sm text-gray-600 text-center px-3">Add credits to your account to use for various services.</p>
                </div>
                </a>
                <a href="/profile">
                <div className="flex flex-col items-center w-full md:w-1/3 p-5 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <div className="h-12 w-12 mb-3">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10C10 11.1 10.9 12 12 12ZM12 14C10.67 14 7 14.92 7 16.25V18H17V16.25C17 14.92 13.33 14 12 14ZM12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 6 12 6ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#9F7AEA" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-center">Profile</h3>
                    <p className="text-sm text-gray-600 text-center px-3">Manage your profile settings and configurations.</p>
                </div>
                </a>

            </div>
        </div>
    );
}

export default DashboardPage;
