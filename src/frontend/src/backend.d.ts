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
export interface Exercise {
    name: string;
    description: string;
    category: string;
}
export interface Customization {
    fontSize: bigint;
    backgroundMusic: string;
}
export interface Task {
    id: bigint;
    completed: boolean;
    description: string;
    category: string;
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
export interface Goal {
    completed: boolean;
    description: string;
    progress: bigint;
    target: bigint;
}
export interface backendInterface {
    addExercise(name: string, description: string, category: string): Promise<void>;
    addGoal(description: string, target: bigint): Promise<void>;
    getCustomizations(): Promise<Customization>;
    getDailyTasks(): Promise<Array<Task>>;
    getExercisesByCategory(category: string): Promise<Array<Exercise>>;
    getGoals(): Promise<Array<Goal>>;
    getTheme(): Promise<Theme>;
    getTotalCalories(): Promise<bigint>;
    getTotalSteps(): Promise<bigint>;
    getWalks(): Promise<Array<WalkSession>>;
    setCustomizations(fontSize: bigint, backgroundMusic: string): Promise<void>;
    setTaskCompleted(taskId: bigint): Promise<boolean>;
    setTheme(themeName: string): Promise<void>;
    trackWalk(session: WalkSession): Promise<void>;
    uploadPhoto(_photo: ExternalBlob): Promise<void>;
}
