import { useEffect, useState } from 'react';
import { getVirtualMachinesHistory, powerOffVirtualMachine } from './../../services/vmService'; // Ensure the path matches your project structure
import { VirtualMachineHistory } from './../../models/VirtualMachineHistory';

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
                    created_at: new Date(vm.created_at).toLocaleString('en-US', { timeZone: 'CET' }), // Format created_at as string
                    powered_off_at: vm.powered_off_at ? new Date(vm.powered_off_at).toLocaleString('en-US', { timeZone: 'CET' }) : '' // Format powered_off_at as string or set it to an empty string if null
                })));
            } catch (error) {
                console.error("Error fetching VM history:", error);
            } finally {
                setLoading(false);  // Set loading to false regardless of the oCETome
            }
        };

        fetchVmHistory();
    }, []);

    // Define a new function to fetch VM history
    const fetchVmHistory = async () => {
        try {
            const history = await getVirtualMachinesHistory();
            setVmHistory(history.map(vm => ({
                ...vm,
                id: vm.id.toString(), // Convert the id to a string
                created_at: new Date(vm.created_at).toLocaleString('en-US', { timeZone: 'CET' }), // Format created_at as string
                powered_off_at: vm.powered_off_at ? new Date(vm.powered_off_at).toLocaleString('en-US', { timeZone: 'CET' }) : '' // Format powered_off_at as string or set it to an empty string if null
            })));
        } catch (error) {
            console.error("Error fetching VM history:", error);
        } finally {
            setLoading(false);  // Set loading to false regardless of the oCETome
        }
    };

    // Function to handle powering off a virtual machine and then fetching updated history
    const handlePowerOffClick = async (vmId: string) => {
        try {
            // Call the powerOffVirtualMachine function
            await powerOffVirtualMachine(parseInt(vmId));
            // After powering off, fetch the updated virtual machine history
            await fetchVmHistory();
        } catch (error) {
            console.error("Error powering off virtual machine:", error);
        }
    };
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8"> 
            {userName ? (
                <h2 className="text-2xl sm:text-3xl font-bold pt-4 mb-8 text-center">Welcome back, {userName}!</h2> // Adjusted text size and margin for mobile, added text-center for centering
            ) : (
                <h2 className="text-2xl sm:text-3xl font-bold pt-4 mb-8 text-center">Welcome to BioCloudLabs!</h2> // Adjusted text size and margin for mobile, added text-center for centering
            )}

            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Your Virtual Machines History</h2> 
                <table className="min-w-full divide-y divide-gray-200 pt-4 mb-12"> 
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                VM Name
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Powered off at
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
                                <tr key={vm.id} className="text-center">
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                        {vm.name}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                        {new Date(vm.created_at).toLocaleString('en-US', { timeZone: 'CET' })}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                        {vm.powered_off_at && new Date(vm.powered_off_at).toString() === 'Invalid Date' ? (
                                            <button onClick={() => handlePowerOffClick(vm.id)} // Call handlePowerOffClick function on button click
                                                className="text-red-500 hover:text-red-700 transition-colors duration-200">
                                                <img src="/images/Blast/turn-off-4783.svg" alt="Power Off" className="w-6 h-6" />
                                            </button>
                                        ) : (
                                            vm.powered_off_at ? new Date(vm.powered_off_at).toLocaleString('en-US', { timeZone: 'CET' }) : ''
                                        )}
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


            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Quick actions</h2> 
            <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="flex flex-col items-center w-full md:w-1/3 p-5 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <a href="/vm-request" className="flex flex-col items-center">
                        <div className="h-12 w-12 mb-3 flex justify-center">
                            <img src="/images/Blast/rocket-launch-9978.svg" alt="Request VM" className="h-full w-full" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-semibold text-center">Request VM</h3>
                            <p className="text-sm text-gray-600 text-center">Start a new virtual machine tailored to your needs.</p>
                        </div>
                    </a>
                </div>
                <div className="flex flex-col items-center w-full md:w-1/3 p-5 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <a href="/credits-offers" className="flex flex-col items-center">
                        <div className="h-12 w-12 mb-3 flex justify-center">
                            <img src="/images/Blast/profit-coin-2967.svg" alt="Add Credits" className="h-full w-full" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-semibold text-center">Add Credits</h3>
                            <p className="text-sm text-gray-600 text-center">Add credits to your account to use for various services.</p>
                        </div>
                    </a>
                </div>
                <div className="flex flex-col items-center w-full md:w-1/3 p-5 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <a href="/profile" className="flex flex-col items-center">
                        <div className="h-12 w-12 mb-3 flex justify-center">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10C10 11.1 10.9 12 12 12ZM12 14C10.67 14 7 14.92 7 16.25V18H17V16.25C17 14.92 13.33 14 12 14ZM12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 6 12 6ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#9F7AEA" /></svg>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-semibold text-center">Profile</h3>
                            <p className="text-sm text-gray-600 text-center">Manage your profile settings and configurations.</p>
                        </div>
                    </a>
                </div>


            </div>



        </div>
    );
}

export default DashboardPage;