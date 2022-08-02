export interface Module {
    modBaseAddr: number;
    modBaseSize: number;
    szExePath: string;
    szModule: string;
    th32ProcessID: number;
    GlblcntUsage: number;
}