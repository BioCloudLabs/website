import { VirtualMachine } from './../models/VirtualMachines';

export async function createVirtualMachine(selectedVM: string): Promise<VirtualMachine> {
  // Simulate an API call to create a virtual machine
  // You can replace this with actual API calls in your application
  return new Promise((resolve) => {
    // Simulate some processing time (2 seconds)
    setTimeout(() => {
      const url = `http://example.com/${selectedVM}`;
      const price = calculatePrice(selectedVM); // You can implement this function to calculate the price based on the selected VM
      const virtualMachine: VirtualMachine = { url, price };
      resolve(virtualMachine);
    }, 2000);
  });
}

function calculatePrice(selectedVM: string): number {
  // Calculate the price based on the selected VM
  // This is just an example, replace it with your actual pricing logic
  switch (selectedVM) {
    case 'vm1':
      return 10.99;
    case 'vm2':
      return 15.99;
    case 'vm3':
      return 20.99;
    default:
      return 0;
  }
}
