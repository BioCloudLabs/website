import React, { useState } from 'react';
import { createVirtualMachine } from './../../services/vmService';

import { VirtualMachine } from './../../models/VirtualMachines';

const JobRequest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [virtualMachine, setVirtualMachine] = useState<VirtualMachine | null>(null);
  const [selectedVM, setSelectedVM] = useState<string>('');
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  const vmSpecs = [
    { name: 'VM1', cpu: '2 vCPUs', memory: '8 GB', price: 10.99 },
    { name: 'VM2', cpu: '4 vCPUs', memory: '16 GB', price: 15.99 },
    { name: 'VM3', cpu: '8 vCPUs', memory: '32 GB', price: 20.99 },
    // Add more VM specifications as needed
  ];

  const handleCreateVirtualMachine = async () => {
    setIsLoading(true);
    try {
      const vm = await createVirtualMachine(selectedVM);
      setVirtualMachine(vm);
      setEstimatedPrice(vm.price);
    } catch (error) {
      console.error('Error creating virtual machine:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVMSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVM = e.target.value;
    setSelectedVM(selectedVM);
    const selectedVMSpec = vmSpecs.find((vm) => vm.name === selectedVM);
    if (selectedVMSpec) {
      setEstimatedPrice(selectedVMSpec.price);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">BLAST Job Request</h1>
      <p className="mb-4">
        BLAST (Basic Local Alignment Search Tool) is a widely used bioinformatics tool for comparing a query sequence
        against a database of sequences.
      </p>
      <p className="mb-4">
        Please select a virtual machine (VM) configuration for running your BLAST job:
      </p>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select VM</label>
        <select
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          value={selectedVM}
          onChange={handleVMSelectChange}
        >
          {vmSpecs.map((vm) => (
            <option key={vm.name} value={vm.name}>
              {vm.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Virtual Machine Specifications</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">VM</th>
              <th className="border border-gray-300 px-4 py-2">CPU</th>
              <th className="border border-gray-300 px-4 py-2">Memory</th>
            </tr>
          </thead>
          <tbody>
            {vmSpecs.map((vm) => (
              <tr key={vm.name}>
                <td className="border border-gray-300 px-4 py-2">{vm.name}</td>
                <td className="border border-gray-300 px-4 py-2">{vm.cpu}</td>
                <td className="border border-gray-300 px-4 py-2">{vm.memory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-600 mb-4">Estimated Price: ${estimatedPrice.toFixed(2)}</p>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-semibold text-blue-500 mb-4">Loading...</h1>
            <div className="loader animate-spin rounded-full border-t-4 border-b-4 border-blue-500 w-12 h-12"></div>
          </div>
        </div>
      ) : (
        <>
          {virtualMachine ? (
            <div className="text-green-500 mb-4">
              <p>Virtual machine created successfully.</p>
              <p>Redirecting to: <a href={virtualMachine.url}>{virtualMachine.url}</a></p>
            </div>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleCreateVirtualMachine}
              disabled={isLoading}
            >
              Run
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default JobRequest;
