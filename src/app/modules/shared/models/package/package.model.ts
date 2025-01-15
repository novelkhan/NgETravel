import { PackageData } from "./packageData.model";

export interface Package {
    packageId: number;
    packageName: string;
    destination: string;
    price: string;
    dateCreated?: string;  // or Date if you want to parse it as a Date object
    packageData?: PackageData
}