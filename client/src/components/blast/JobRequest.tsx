import React, { useState, useEffect } from 'react';
import { createVirtualMachine, fetchVMSpecs } from './../../services/vmService';
import { notify } from '../../utils/notificationUtils';
import { useNavigate } from 'react-router-dom';

const JobRequest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [vmSpecs, setVmSpecs] = useState<any[]>([]);
  const [selectedVM, setSelectedVM] = useState<any | null>(null);
  const navigate = useNavigate();
  const userCredits = parseFloat(localStorage.getItem('userCredits') || '0');

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const specs = await fetchVMSpecs();
        setVmSpecs(specs);
        setSelectedVM(specs[0]); // Set the first VM spec as default
      } catch (error) {
        console.error('Error fetching VM specifications:', error);
        notify('Error fetching VM specifications.', 'error');
      }
    };
    fetchSpecs();
  }, []);

  const handleCreateVirtualMachine = async () => {
    if (!selectedVM || userCredits < selectedVM.credits) { // Check if user has enough credits
      notify('Insufficient credits to run this VM.', 'error');
      return;
    }
    notify('Initiating VM creation process...', 'info');
    setIsLoading(true);
    sessionStorage.setItem('vmSetupInProgress', 'true'); // Indicate that VM setup is in progress
    createVirtualMachine() // Removed selectedVM parameter
      .then(vm => {
        localStorage.setItem('vmDetails', JSON.stringify({
          ip: vm.ip,
          dns: vm.dns,
          price: vm.price,
          url: vm.url
        }));
        sessionStorage.setItem('vmSetupInProgress', 'false');
        notify('Virtual machine creation process initiated.', 'info');
        navigate('/status-vm', { state: { vmName: selectedVM.name } });
      })
      .catch(error => {
        console.error('Error creating virtual machine:', error);
        notify(`Error creating virtual machine: ${(error as Error).message}`, 'error');
        sessionStorage.setItem('vmSetupInProgress', 'false');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVMSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVM = vmSpecs.find(vm => vm.name === e.target.value);
    if (selectedVM) {
      setSelectedVM(selectedVM);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 my-8 text-center">Launch Virtual Machine</h1>
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 mx-4">
        <p className="text-lg text-gray-700 mb-4">
          BLAST (Basic Local Alignment Search Tool) is a powerful tool used to find regions of similarity between biological sequences. It compares nucleotide or protein sequences to sequence databases and calculates the statistical significance of the matches.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Our service provides a virtual machine pre-configured with BLAST tools, enabling you to perform complex sequence analysis tasks efficiently. The selected VM is designed to handle small to medium BLAST jobs, offering a balanced combination of processing power and memory.
        </p>
        <div className="mb-6">
          <label htmlFor="vmSelect" className="block text-sm font-medium text-gray-700">Select VM</label>
          <select
            id="vmSelect"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={selectedVM ? selectedVM.name : ''}
            onChange={handleVMSelectChange}
            disabled={vmSpecs.length === 0}
          >
            {vmSpecs.map((vm) => (
              <option key={vm.name} value={vm.name}>
                {vm.name}
              </option>
            ))}
          </select>
        </div>
        {selectedVM && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Virtual Machine Specifications</h2>
            <div className="bg-blue-100 p-4 rounded-lg">
              <ul className="list-disc pl-5 text-lg text-gray-800">
                <li><strong>VM Name:</strong> {selectedVM.name}</li>
                <li><strong>CPU:</strong> {selectedVM.cpu}</li>
                <li><strong>Memory:</strong> {selectedVM.memory}</li>
                <li><strong>Estimated cost:</strong> {selectedVM.credits} Credits/hour.</li>
                <li><strong>Description:</strong> {selectedVM.description}</li>
              </ul>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-semibold text-blue-500 mb-4">Loading...</h1>
              <div className="loader animate-spin rounded-full border-t-4 border-b-4 border-blue-500 w-12 h-12"></div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              className="inline-flex items-center justify-center bg-blue-700 text-white border-0 py-3 px-8 focus:outline-none hover:bg-blue-800 rounded-lg text-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={handleCreateVirtualMachine}
              disabled={isLoading || !selectedVM}
            >
              Run
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRequest;
