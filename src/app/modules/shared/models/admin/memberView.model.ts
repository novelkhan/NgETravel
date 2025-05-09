export interface MemberView {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    dateCreated: Date;
    isLocked: boolean;
    isEmailConfirmed: boolean;
    roles: string[];
}