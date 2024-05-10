import { useEffect, useState } from 'react';
import { getVirtualMachinesHistory } from './../../services/vmService'; // adjust the import path as needed

interface VirtualMachineHistory {
    id: string;
    name: string;
    created_at: string;
    powered_off_at: string | null;
}

function DashboardPage() {
    const [userName, setUserName] = useState<string>('');
    const [vmHistory, setVmHistory] = useState<VirtualMachineHistory[]>([]);

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
                const convertedHistory = history.map(vm => ({
                    ...vm,
                    id: vm.id.toString(),
                    created_at: vm.created_at.toString(), // Convert created_at to string
                    powered_off_at: vm.powered_off_at?.toString() ?? null // Convert powered_off_at to string or provide null if undefined
                }));
                setVmHistory(convertedHistory);
            } catch (error) {
                console.error("Error fetching VM history:", error);
            }
        };

        fetchVmHistory();
    }, []);

    return (
        <div className="p-8">
            {userName ? (
                <h2 className="text-3xl font-bold pt-4 my-12">Welcome, {userName}!</h2>
            ) : (
                <h2 className="text-3xl font-bold pt-4 my-12">Welcome!</h2>
            )}
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

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
                        {vmHistory.map((vm) => (
                            <tr key={vm.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {vm.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(vm.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {vm.powered_off_at ? new Date(vm.powered_off_at).toLocaleDateString() : "N/A"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DashboardPage;
