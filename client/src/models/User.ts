export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    surname: string;
    created_at: string; // The type date is converted to string since it's inside a JSON - following a standard like ISO 8601 (e.g., 2021-04-01T12:34:56Z)
    updated_at: string; // The type date is converted to string since it's inside a JSON - following a standard like ISO 8601 (e.g., 2021-04-01T12:34:56Z)
    role_id: number;
    credits: number;
    location_id: number;
  } 