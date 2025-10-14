export interface MemberView {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;  // New field
    isLocked: boolean;
    dateCreated: Date;
    isEmailConfirmed: boolean;
    roles: string[];
}