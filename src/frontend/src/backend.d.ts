import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Theme {
    primaryColor: string;
    name: string;
    accentColor: string;
    secondaryColor: string;
}
export interface WalkSession {
    durationInSeconds: bigint;
    distanceInMeters: number;
    steps: bigint;
    caloriesBurned: bigint;
}
export interface backendInterface {
    getTheme(): Promise<Theme>;
    getTotalCalories(): Promise<bigint>;
    getTotalSteps(): Promise<bigint>;
    getWalks(): Promise<Array<WalkSession>>;
    setTheme(themeName: string): Promise<void>;
    trackWalk(session: WalkSession): Promise<void>;
    uploadPhoto(photo: ExternalBlob): Promise<void>;
}
