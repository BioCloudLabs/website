import React, { useEffect, useState } from 'react';
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
                <h2 className="text-3xl font-bold pt-4 my-12">Welcome!</h2>
            )}
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="flex flex-col md:flex-row justify-around items-center mt-6">
                <div className="flex-1 max-w-sm p-5 m-2 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <div className="flex justify-center">
                        <span className="text-4xl text-blue-500">
                            <i className="fas fa-server"></i> {/* Icon can be replaced with any appropriate font-awesome icon */}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-center mt-4">Request VM</h3>
                    <p className="text-sm text-gray-600 text-center mt-2">Start a new virtual machine tailored to your needs.</p>
                </div>
                <div className="flex-1 max-w-sm p-5 m-2 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <div className="flex justify-center">
                        <span className="text-4xl text-green-500">
                            <i className="fas fa-wallet"></i> {/* Icon can be replaced with any appropriate font-awesome icon */}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-center mt-4">Add Credits</h3>
                    <p className="text-sm text-gray-600 text-center mt-2">Add credits to your account to use for various services.</p>
                </div>
                <div className="flex-1 max-w-sm p-5 m-2 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <div className="flex justify-center">
                        <span className="text-4xl text-purple-500">
                            <i className="fas fa-user-circle"></i> {/* Icon can be replaced with any appropriate font-awesome icon */}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-center mt-4">Profile</h3>
                    <p className="text-sm text-gray-600 text-center mt-2">Manage your profile settings and configurations.</p>
                </div>
            </div>


            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Your Virtual Machines History</h2>
                <table className="min-w-full divide-y divide-gray-200">
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
        </div>
    );
}

export default DashboardPage;
