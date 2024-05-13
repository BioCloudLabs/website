import { useEffect, useState } from 'react';
import { getVirtualMachinesHistory, powerOffVirtualMachine } from './../../services/vmService'; // Ensure the path matches your project structure
import { VirtualMachineHistory } from './../../models/VirtualMachineHistory';

function DashboardPage() {
    const [userName, setUserName] = useState<string>('');
    const [vmHistory, setVmHistory] = useState<VirtualMachineHistory[]>([]);

    const [loading, setLoading] = useState<boolean>(true);  // State to track loading status
    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 5;

    // Function to go to the next page
    const nextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    // Function to go to the previous page
    const prevPage = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
    };

    // Calculate number of pages
    const numPages = Math.ceil(vmHistory.length / ITEMS_PER_PAGE);

    // Slice the data for the current page
    const currentData = vmHistory.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    // Pagination Component
    const Pagination = () => (
        <div className="flex flex-col items-center my-6 text-gray-900">
            <span className="text-sm text-gray-900 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-blak">{currentPage * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700 dark:text-gray-400">{vmHistory.length}</span> Entries
            </span>
            <div className="inline-flex mt-2">
                <button
                    onClick={prevPage}
                    className="px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    disabled={currentPage === 0}
                >
                    Prev
                </button>
                <button
                    onClick={nextPage}
                    className="px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    disabled={currentPage >= numPages - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );



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


    const VirtualMachineCard = ({ vm }: { vm: any }) => {
        return (
            <div className="bg-white shadow-lg rounded-lg p-4 mb-4 flex flex-col items-center text-center">
                <h3 className="text-lg font-semibold">{vm.name}</h3>
                <p className="text-sm text-gray-600">Created at: {vm.created_at}</p>
                <p className="text-sm text-gray-600">Powered off at: {vm.powered_off_at || 'Still Running'}</p>
                {!vm.powered_off_at && (
                    <button
                        onClick={() => handlePowerOffClick(vm.id)}
                        className="mt-2 flex items-center justify-center p-2 bg-red-500 hover:bg-red-700 rounded"
                    >
                        <img src="/images/Blast/turn-off-4783.svg" alt="Power Off" className="w-6 h-6" />
                    </button>
                )}

            </div>
        );
    };




    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {userName ? (
                <h2 className="text-2xl sm:text-3xl font-bold pt-4 mb-8 text-center">Welcome back, {userName}!</h2>
            ) : (
                <h2 className="text-2xl sm:text-3xl font-bold pt-4 mb-8 text-center">Welcome to BioCloudLabs!</h2>
            )}

            <div className="mb-12 mt-12">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Your Virtual Machines History</h2>
                {loading ? (
                    <div className="text-center">Loading virtual machines history...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentData.map((vm) => (
                            <VirtualMachineCard key={vm.id} vm={vm} />
                        ))}
                    </div>
                )}
                <Pagination />
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