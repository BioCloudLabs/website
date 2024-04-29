import React, { useState } from 'react';
import { createVirtualMachine } from './../../services/vmService';
import { VirtualMachine } from './../../models/VirtualMachines';

type VMSpec = {
  name: string;
  cpu: string;
  memory: string;
  credits: number; // Replacing price with credits
  description: string;
};

// Reference:

// https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/?ef_id=_k_Cj0KCQjwir2xBhC_ARIsAMTXk85h4yFmSV1nGQdFb5e27ZDIpZsI6cf-Fr1fn-BciCRIn59pIiIUWKwaAp5rEALw_wcB_k_&OCID=AIDcmm68ejnsa0_SEM__k_Cj0KCQjwir2xBhC_ARIsAMTXk85h4yFmSV1nGQdFb5e27ZDIpZsI6cf-Fr1fn-BciCRIn59pIiIUWKwaAp5rEALw_wcB_k_&gad_source=1&gclid=Cj0KCQjwir2xBhC_ARIsAMTXk85h4yFmSV1nGQdFb5e27ZDIpZsI6cf-Fr1fn-BciCRIn59pIiIUWKwaAp5rEALw_wcB#pricing

// VM specifications array updated to include credits
const vmSpecs: VMSpec[] = [
  { name: 'VM1', cpu: '2 vCPUs', memory: '8 GB', credits: 0.0922, description: 'Basic VM for small BLAST jobs.' },
  { name: 'VM2', cpu: '4 vCPUs', memory: '16 GB', credits: 0.1847, description: 'Intermediate VM for medium-sized BLAST jobs.' },
  { name: 'VM3', cpu: '8 vCPUs', memory: '32 GB', credits: 0.3685, description: 'Advanced VM for complex BLAST jobs.' },
  { name: 'VM4', cpu: '16 vCPUs', memory: '64 GB', credits: 0.7369, description: 'High-performance VM for large BLAST jobs.' },
  { name: 'VM5', cpu: '32 vCPUs', memory: '128 GB', credits: 1.4748, description: 'Super VM for the most demanding BLAST jobs.' },
];

const JobRequest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [virtualMachine, setVirtualMachine] = useState<VirtualMachine | null>(null);
  const [selectedVM, setSelectedVM] = useState<string>(vmSpecs[0].name);
  const [estimatedCredits, setEstimatedCredits] = useState<number>(vmSpecs[0].credits);

  const handleCreateVirtualMachine = async () => {
    setIsLoading(true);
    try {
      const vm = await createVirtualMachine(selectedVM);
      setVirtualMachine(vm);
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
      setEstimatedCredits(selectedVMSpec.credits);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">BLAST Job Request</h1>
      <p className="mb-4">
        BLAST (Basic Local Alignment Search Tool) is a tool that finds regions of similarity between biological sequences.
        It compares nucleotide or protein sequences to sequence databases and calculates the statistical significance.
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
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">VM</th>
              <th className="border border-gray-300 px-4 py-2">CPU</th>
              <th className="border border-gray-300 px-4 py-2">Memory</th>
              <th className="border border-gray-300 px-4 py-2">€/hour</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {vmSpecs.map((vm) => (
              <tr key={vm.name} className={`${vm.name === selectedVM ? 'bg-blue-100' : ''}`}>
                <td className="border border-gray-300 px-4 py-2">{vm.name}</td>
                <td className="border border-gray-300 px-4 py-2">{vm.cpu}</td>
                <td className="border border-gray-300 px-4 py-2">{vm.memory}</td>
                <td className="border border-gray-300 px-4 py-2">{vm.credits}</td>
                <td className="border border-gray-300 px-4 py-2">{vm.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-600 mb-4">Estimated Credits per hour: {estimatedCredits}</p>
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
            <div className="text-green-500 mb-4">
              <p>Virtual machine created successfully.</p>
              <p>Redirecting to: <a href={virtualMachine.url}>{virtualMachine.url}</a></p>
            </div>
          ) : (
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none"
              onClick={handleCreateVirtualMachine}
              disabled={!selectedVM || isLoading}
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
