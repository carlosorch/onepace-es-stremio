// src/stremio-addon-sdk.d.ts
declare module 'stremio-addon-sdk' {
  export interface Manifest {
    id: string;
    version: string;
    name: string;
    description?: string;
    logo?: string;
    background?: string;
    types: string[];
    resources: string[];
    catalogs: any[];
    idPrefixes?: string[];
    behaviorHints?: {
      configurable?: boolean;
      [key: string]: any;
    };
  }

  export class addonBuilder {
    constructor(manifest: Manifest);
    defineCatalogHandler(handler: (args: any) => Promise<any>): void;
    defineMetaHandler(handler: (args: any) => Promise<any>): void;
    defineStreamHandler(handler: (args: any) => Promise<any>): void;
    getInterface(): any;
  }

  export function getRouter(addonInterface: any): any;
}
