import { PackageImage } from "./packageImage.model";

export interface PackageData {
  packageDataId?: number;
  description?: string;
  viaDestination?: string;
  date?: string;  // or Date if you want to parse it as a Date object
  availableSeat?: number;
  packageImages?: PackageImage[];

  packageId?: number;
}