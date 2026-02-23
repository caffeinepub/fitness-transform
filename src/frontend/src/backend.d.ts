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
export interface Location {
    latitude: number;
    longitude: number;
}
export interface Exercise {
    name: string;
    description: string;
    category: string;
}
export type Time = bigint;
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
export interface RecommendedWalk {
    id: bigint;
    isCompleted: boolean;
    name: string;
    description: string;
    distance: number;
    isFavourite: boolean;
    location: Location;
}
export interface Theme {
    primaryColor: string;
    name: string;
    accentColor: string;
    secondaryColor: string;
}
export interface WalkRating {
    walkType: WalkType;
    rating: bigint;
    completionTimestamp: Time;
}
export interface WalkSession {
    durationInSeconds: bigint;
    distanceInMeters: number;
    steps: bigint;
    rating?: WalkRating;
    caloriesBurned: bigint;
}
export interface Goal {
    completed: boolean;
    description: string;
    progress: bigint;
    target: bigint;
}
export enum WalkType {
    Recommended = "Recommended",
    Tracked = "Tracked"
}
export interface backendInterface {
    addExercise(_profileId: string, name: string, description: string, category: string): Promise<void>;
    addGoal(profileId: string, description: string, target: bigint): Promise<void>;
    addRecommendedWalk(_profileId: string, name: string, description: string, distance: number, location: Location): Promise<void>;
    filterWalksByLocation(_profileId: string, userLocation: Location, maxDistance: number): Promise<Array<RecommendedWalk>>;
    getCustomizations(profileId: string): Promise<Customization>;
    getDailyTasks(profileId: string): Promise<Array<Task>>;
    getExercisesByCategory(_profileId: string, category: string): Promise<Array<Exercise>>;
    getGoals(profileId: string): Promise<Array<Goal>>;
    getRecommendedWalks(_profileId: string): Promise<Array<RecommendedWalk>>;
    getTheme(profileId: string): Promise<Theme>;
    getTotalCalories(profileId: string): Promise<bigint>;
    getTotalSteps(profileId: string): Promise<bigint>;
    getUserWalkHistory(profileId: string): Promise<Array<bigint>>;
    getWalks(profileId: string): Promise<Array<WalkSession>>;
    markWalkCompleted(profileId: string, walkId: bigint): Promise<void>;
    markWalkFavourite(_profileId: string, walkId: bigint): Promise<void>;
    setCustomizations(profileId: string, fontSize: bigint, backgroundMusic: string): Promise<void>;
    setTaskCompleted(profileId: string, taskId: bigint): Promise<boolean>;
    setTheme(profileId: string, themeName: string): Promise<void>;
    trackWalk(profileId: string, session: WalkSession): Promise<void>;
    uploadPhoto(_photo: ExternalBlob): Promise<void>;
}
