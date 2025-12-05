export interface GuestEntry {
  id: string;
  name: string;
  message: string;
  date: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
