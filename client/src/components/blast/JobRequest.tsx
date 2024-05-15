import React, { useState } from 'react';
import { createVirtualMachine } from './../../services/vmService';
import { VirtualMachine } from './../../models/VirtualMachines';
import { notify } from '../../utils/notificationUtils';
import { useNavigate } from 'react-router-dom';

const vmSpec = {
  name: 'Standard B2S',
  cpu: '2 vCPUs',
  memory: '4 GB',
  credits: 3,
  description: 'Standard VM for small to medium BLAST jobs.'
};

const JobRequest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [virtualMachine, setVirtualMachine] = useState<VirtualMachine | null>(null);
  const navigate = useNavigate();
  const userCredits = parseFloat(localStorage.getItem('userCredits') || '0');

  const handleCreateVirtualMachine = async () => {
    if (userCredits <= 20) {
      notify('Insufficient credits to run this VM.', 'error');
      return;
    }
  
    notify('Initiating VM creation process...', 'info');
  
    setIsLoading(true);
  
    // Proceed to attempt VM creation
    createVirtualMachine(vmSpec.name)
      .then(vm => {
        localStorage.setItem('vmDetails', JSON.stringify({
          ip: vm.ip,
          dns: vm.dns,
          price: vm.price,
          url: vm.url
        }));
        sessionStorage.setItem('vmSetupInProgress', 'false');
        notify('Virtual machine creation process initiated.', 'info');
        navigate('/status-vm', { state: { vmName: vmSpec.name } });
        setVirtualMachine(vm);
      })
      .catch(error => {
        console.error('Error creating virtual machine:', error);
        notify(`Error creating virtual machine: ${(error as Error).message}`, 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 mx-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 my-8 text-center">Launch Virtual Machine</h1>
        <p className="text-lg text-gray-700 mb-4">
          BLAST (Basic Local Alignment Search Tool) is a powerful tool used to find regions of similarity between biological sequences. It compares nucleotide or protein sequences to sequence databases and calculates the statistical significance of the matches.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Our service provides a virtual machine pre-configured with BLAST tools, enabling you to perform complex sequence analysis tasks efficiently. The selected VM is designed to handle small to medium BLAST jobs, offering a balanced combination of processing power and memory.
        </p>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Virtual Machine Specifications</h2>
          <div className="bg-blue-100 p-4 rounded-lg">
            <ul className="list-disc pl-5 text-lg text-gray-800">
              <li><strong>VM Name:</strong> {vmSpec.name}</li>
              <li><strong>CPU:</strong> {vmSpec.cpu}</li>
              <li><strong>Memory:</strong> {vmSpec.memory}</li>
              <li><strong>Estimated cost:</strong> {vmSpec.credits} Credits/hour.</li>
              <li><strong>Description:</strong> {vmSpec.description}</li>
            </ul>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-semibold text-blue-500 mb-4">Loading...</h1>
              <div className="loader animate-spin rounded-full border-t-4 border-b-4 border-blue-500 w-12 h-12"></div>
            </div>
          </div>
        ) : (
          <>
            {virtualMachine ? (
              <div className="text-green-500 mb-4 text-center">
                <p>Virtual machine created successfully.</p>
                <p>Redirecting to: <a href={virtualMachine.url} className="text-blue-600 hover:underline">{virtualMachine.url}</a></p>
              </div>
            ) : (
              <div className="text-center">
                <button
                  className="inline-flex items-center justify-center bg-blue-700 text-white border-0 py-3 px-8 focus:outline-none hover:bg-blue-800 rounded-lg text-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                  onClick={handleCreateVirtualMachine}
                  disabled={isLoading}
                >
                  Run
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobRequest;
