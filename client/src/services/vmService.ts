import { VirtualMachine } from './../models/VirtualMachines';
import { VirtualMachineHistory } from './../models/VirtualMachineHistory';



export async function createVirtualMachine(selectedVM: string): Promise<VirtualMachine> {
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
      console.error('HTTP error: ', data.message);
      throw new Error(`HTTP error! Status: ${response.status} Message: ${data.message}`);
    }

    return {
      dns: data.dns,
      ip: data.ip,
      url: `https://${data.dns}`,
      price: calculatePrice(selectedVM)
    };
  } catch (error) {
    console.error("Failed to create virtual machine:", error);
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
      console.error('HTTP error: ', data.message);
      throw new Error(`HTTP error! Status: ${response.status} Message: ${data.message}`);
    }

    return data.message;
  } catch (error) {
    console.error("Failed to power off virtual machine:", error);
    throw error;
  }
}

/**
 * Fetches the history of virtual machines for the logged-in user.
 *
 * @returns A promise that resolves to an array of `VirtualMachineHistory` objects if the fetch is successful.
 * @throws An error with a user-friendly message if the fetch fails.
 */
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

    // Handle non-OK responses by parsing error data
    if (!response.ok) {
      const errorData = await response.json();

      // Specific checks for different backend messages
      if (response.status === 404) {
        if (errorData.message === "User not found") {
          throw new Error('User account not found. Please log in again.');
        } else if (errorData.message === "No VMs found") {
          throw new Error('No virtual machines found in your history.');
        }
      } else if (response.status === 401 && errorData.message === 'Token has expired') {
        throw new Error('Your session has expired. Please log in again.');
      }

      // Generic error message for other cases
      throw new Error(errorData.message || 'Failed to retrieve virtual machine history. Please try again later.');
    }

    // If response is OK, parse the successful response
    const data = await response.json();
    return data.vm_list.map((vm: any) => ({
      id: vm.id,
      name: vm.name,
      created_at: vm.created_at,
      powered_off_at: vm.powered_off_at // Assuming typo fix in backend: 'poweredof_at' to 'powered_off_at'
    }));
  } catch (error) {
    console.error('Failed to retrieve virtual machine history:', error);
    throw error; // Rethrow the error to handle it appropriately elsewhere
  }
}


function calculatePrice(selectedVM: string): number {
  switch (selectedVM) {
    case 'vm1':
      return 10.99;
    case 'vm2':
      return 15.99;
    case 'vm3':
      return 20.99;
    default:
      throw new Error('Unknown virtual machine type');
  }
}
