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

export async function getVirtualMachinesHistory(): Promise<VirtualMachineHistory[]> {
  const apiUrl = `/api/azurevm/history`;

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

    return data.vm_list.map((vm: any) => ({
      id: vm.id,
      name: vm.name,
      created_at: vm.created_at,
      powered_off_at: vm.poweredof_at // ensure this typo is fixed in the backend (poweredof_at -> powered_off_at)
    }));
  } catch (error) {
    console.error("Failed to retrieve virtual machine history:", error);
    throw error;
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
