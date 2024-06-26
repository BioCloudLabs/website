import { VirtualMachine } from './../models/VirtualMachines';
import { VirtualMachineHistory } from './../models/VirtualMachineHistory';

// Mock VM specifications
const vmSpecs = [
  {
    name: 'Standard B2S',
    cpu: '2 vCPUs',
    memory: '4 GB',
    credits: 3,
    description: 'Standard VM for small to medium BLAST jobs. Minimum requirements for BLAST analysis.'
  },
  {
    name: 'Standard B2pls v2 - Medium performance',
    cpu: '2 vCPUs',
    memory: '4 GB',
    credits: 6,
    description: 'Economical VM for development, test servers, and low traffic web servers.'
  },
  {
    name: 'Standard B4pls v2 - High performance',
    cpu: '4 vCPUs',
    memory: '8 GB',
    credits: 10,
    description: 'Economical VM for medium traffic web servers and small databases.'
  },
  {
    name: 'Standard B8pls v2 - Top performance',
    cpu: '8 vCPUs',
    memory: '16 GB',
    credits: 20,
    description: 'High-performance VM for large applications and microservices.'
  }
];

// Fetch VM specifications
export const fetchVMSpecs = (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(vmSpecs);
    }, 100);
  });
};

export async function createVirtualMachine(): Promise<VirtualMachine> { // Removed selectedVM
  const apiUrl = `/api/azurevm/setup`;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authorization token not found');
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    if (!response.ok) {
      // console.error('HTTP error: ', data.message);
      throw new Error(`HTTP error! Status: ${response.status} Message: ${data.message}`);
    }

    return {
      dns: data.dns,
      ip: data.ip,
      url: `https://${data.dns}`,
      price: data.price // Assuming the API response includes the price
    };
  } catch (error) {
    // console.error("Failed to create virtual machine:", error);
    throw error;
  }
}

export async function powerOffVirtualMachine(vmId: number): Promise<string> {
  const apiUrl = `/api/azurevm/poweroff`;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authorization token not found');
    }

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: vmId })
    });

    const data = await response.json();
    if (!response.ok) {
      // console.error('HTTP error: ', data.message);
      throw new Error(`HTTP error! Status: ${response.status} Message: ${data.message}`);
    }

    return data.message;
  } catch (error) {
    // console.error("Failed to power off virtual machine:", error);
    throw error;
  }
}

export async function getVirtualMachinesHistory(): Promise<VirtualMachineHistory[]> {
  const apiUrl = `/api/azurevm/history`;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authorization token not found. Please log in again.');
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 404) {
        if (errorData.message === "User not found") {
          throw new Error('User account not found. Please log in again.');
        } else if (errorData.message === "No VMs found") {
          throw new Error('No virtual machines found in your history.');
        }
      } else if (response.status === 401 && errorData.message === 'Token has expired') {
        throw new Error('Your session has expired. Please log in again.');
      }

      throw new Error(errorData.message || 'Failed to retrieve virtual machine history. Please try again later.');
    }

    const data = await response.json();
    return data.vm_list.map((vm: any) => ({
      id: vm.id.toString(),
      name: vm.name,
      created_at: new Date(Date.parse(vm.created_at)).toLocaleString('en-US', { timeZone: 'UTC' }),
      powered_off_at: vm.powered_off_at ? new Date(Date.parse(vm.powered_off_at)).toLocaleString('en-US', { timeZone: 'UTC' }) : null,
      cost: vm.cost
    }));
  } catch (error) {
    // console.error('Failed to retrieve virtual machine history:', error);
    throw error;
  }
}
