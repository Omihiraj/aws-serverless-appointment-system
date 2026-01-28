export type UserType = "Admin" | "Super Admin";
export type UserStatus = "Active" | "Inactive";
export interface User {
  id: string;
  name: string;
  staffId: string;
  mobile: string;
  email: string;
  type: UserType;
  status: UserStatus;
}