import { VirtualMachine } from './../models/VirtualMachines';

export async function createVirtualMachine(selectedVM: string): Promise<VirtualMachine> {
  const apiUrl = `api/azurevm/setup`; // Adjust this URL based on where the service is hosted

  try {
    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage
    if (!token) {
      throw new Error('Authorization token not found');
    }

    const response = await fetch(apiUrl, {
      method: 'GET', // Or POST backend expects a POST request
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    if (!response.ok) {
      // Specific error handling similar to user registration example
      if (data.code === 500) {
        console.error('Internal Server Error: ', data.status);
        throw new Error('Internal server error. Please try again.');
      } else {
        console.error('HTTP error: ', data.status);
        throw new Error(`HTTP error! Status: ${response.status} Message: ${data.status}`);
      }
    }

    return {
      ip: data.ip, // Add the 'ip' property
      url: `https://${data.dns}`, // Assuming the DNS to connect to the VM
      price: calculatePrice(selectedVM) // Continue using this function or adapt as needed
    };
  } catch (error) {
    console.error("Failed to create virtual machine:", error);
    throw error; // Re-throw the error if you want to handle it further up the chain
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
      return 0; // Consider throwing an error or a default price if the VM type is unknown
  }
}
