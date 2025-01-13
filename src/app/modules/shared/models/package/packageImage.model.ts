export interface PackageImage {
    packageImageId?: number;
    filename?: string;
    filetype?: string;
    filesize?: string;
    filebytes?: any;  // Base64 or binary format depending on how it is serialized
    
    packageDataId?: number;
    image?: any;
}