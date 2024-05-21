import { useEffect, useState } from 'react';
import { getVirtualMachinesHistory, powerOffVirtualMachine } from './../../services/vmService'; 
import { VirtualMachineHistory } from './../../models/VirtualMachineHistory';
import { notify } from './../../utils/notificationUtils'; 


function DashboardPage() {
    const [vmHistory, setVmHistory] = useState<VirtualMachineHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 6;
    const [filter, setFilter] = useState<string>('ALL');
    const [loadingVms, setLoadingVms] = useState<{ [key: string]: boolean }>({});
    const [loadingText, setLoadingText] = useState<string>('Powering off');

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (Object.values(loadingVms).includes(true)) {
            interval = setInterval(() => {
                setLoadingText((prev) => {
                    if (prev.endsWith('...')) return 'Powering off';
                    return prev + '.';
                });
            }, 500);
        } else {
            setLoadingText('Powering off');
        }

        return () => clearInterval(interval);
    }, [loadingVms]);




    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
        setCurrentPage(0); // Reset to the first page on filter change
    };


    const filteredData = vmHistory.filter((vm) => {
        if (filter === 'ON') return vm.powered_off_at === 'Still Running';
        if (filter === 'OFF') return vm.powered_off_at !== 'Still Running';
        return true;
    });

    const nextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
    };

    const currentData = filteredData.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    const Pagination = () => {
        const numPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        return (
            <>
                {filteredData.length > 0 && (
                    <div className="flex flex-col items-center my-6 text-gray-900">
                        <span className="text-sm text-gray-900 dark:text-gray-500">
                            Showing <span className="font-semibold text-gray-900 dark:text-black">{currentPage * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-900 dark:text-black">{Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredData.length)}</span> of <span className="font-semibold text-gray-900 dark:text-black">{filteredData.length}</span> Entries
                        </span>
                        <div className="inline-flex mt-2">
                            <button
                                onClick={prevPage}
                                className="px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                disabled={currentPage === 0}
                            >
                                Prev
                            </button>
                            <button
                                onClick={nextPage}
                                className="px-4 h-10 text-base font-medium text-white bg-gray-200 rounded-r hover:bg-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                disabled={currentPage >= numPages - 1}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    };


    const fetchVmHistory = async () => {
        try {
            const history = await getVirtualMachinesHistory();
            setVmHistory(
                history
                    .map(vm => ({
                        ...vm,
                        id: vm.id.toString(),
                        created_at: new Date(Date.parse(vm.created_at)).toLocaleString('en-US', { timeZone: 'UTC' }),
                        powered_off_at: vm.powered_off_at ? new Date(Date.parse(vm.powered_off_at)).toLocaleString('en-US', { timeZone: 'UTC' }) : 'Still Running',
                        cost: vm.cost
                    }))
                    .reverse() // Reverse the order to show the newest first
            );
        } catch (error) {
            console.error("Error fetching VM history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVmHistory();
    }, []);

    const handlePowerOffClick = async (vmId: string) => {
        setLoadingVms((prev) => ({ ...prev, [vmId]: true }));
        notify('Powering off VM...', 'info');
        try {
            await powerOffVirtualMachine(parseInt(vmId));
            await fetchVmHistory();
            notify('VM has been powered off successfully', 'success');
        } catch (error) {
            console.error("Error powering off virtual machine:", error);
            notify('Failed to power off the VM', 'error');
        } finally {
            setLoadingVms((prev) => ({ ...prev, [vmId]: false }));
        }
    };


    const VirtualMachineCard = ({ vm }: { vm: VirtualMachineHistory }) => (
        <div className="bg-white shadow-lg rounded-lg py-6 px-4 mb-4 flex flex-col justify-between mx-4">
            <a href={`/vm/${vm.id}`} className="text-lg font-semibold text-center text-blue-600 hover:underline">
                {vm.name}
            </a>
            <div className="flex flex-col items-center space-y-2 mt-4 flex-grow">
                <p className="text-sm text-gray-600">Cost: {vm.cost} credits</p>
                <p className="text-sm text-gray-600">Created at: {vm.created_at}</p>
                {vm.powered_off_at !== 'Still Running' ? (
                    <p className="text-sm text-gray-600">Powered off at: {vm.powered_off_at as string}</p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600">This VM is currently running.</p>
                        {loadingVms[vm.id] ? (
                            <button className="flex items-center justify-center p-2 bg-blue-500 text-white rounded mt-2 w-36 h-10" disabled>
                                <span className="text-center">{loadingText}</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => handlePowerOffClick(vm.id)}
                                className="flex items-center justify-center p-2 bg-red-500 text-white hover:bg-red-700 rounded mt-2 w-36 h-10"
                            >
                                <img src="/images/Blast/turn-off-4783.svg" alt="Power Off" className="w-6 h-6 mr-2" />
                                <span>Power Off</span>
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );


    return (
        <div className="px-4 lg:px-8 py-8 bg-gray-100 min-h-screen">
            <h2 className="text-2xl sm:text-3xl font-bold pt-4 my-4 mb-8 text-center">Welcome to BioCloudLabs!</h2>
            <div className="mb-6">
                <div className="flex flex-col items-center justify-center mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Your Virtual Machines History</h2>
                    <div className="flex items-center">
                        <label htmlFor="filter" className="mr-2">Filter by VM status:</label>
                        <select id="filter" value={filter} onChange={handleFilterChange} className="border rounded p-2">
                            <option value="ALL">ALL</option>
                            <option value="ON">ON</option>
                            <option value="OFF">OFF</option>
                        </select>
                    </div>
                </div>
                {loading ? (
                    <div className="text-center">Loading virtual machines history...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-4 justify-items-center">
                        {filteredData.length === 0 ? (
                            <div className="col-span-full flex justify-center mt-4">
                                <div className="text-center text-gray-600 border border-gray-200 rounded-lg p-4 max-w-md">
                                    No virtual machines have been launched yet.
                                </div>
                            </div>
                        ) : (
                            currentData.map((vm) => (
                                <VirtualMachineCard key={vm.id} vm={vm} />
                            ))
                        )}
                    </div>
                )}
                <Pagination />
            </div>

            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Quick actions</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="flex flex-col items-center w-full md:w-1/3 p-5 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <a href="/launch-vm" className="flex flex-col items-center">
                        <div className="h-12 w-12 mb-3 flex justify-center">
                            <img src="/images/Blast/rocket-launch-9978.svg" alt="Request VM" className="h-full w-full" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-semibold text-center">Launch VM</h3>
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