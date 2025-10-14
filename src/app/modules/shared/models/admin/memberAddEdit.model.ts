export interface MemberAddEdit {
    id?: string;
    userName: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;  // New field
    password?: string;
    roles: string;
}