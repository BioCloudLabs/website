export interface VirtualMachineHistory {
    id: number;
    name: string;
    created_at: Date;
    powered_off_at?: Date;
  }