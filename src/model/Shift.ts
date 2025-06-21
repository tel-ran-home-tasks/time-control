export interface Shift {
    employeeId: string;
    startedAt: string;
    end?: string;
    breaks: { type: "15m" | "30m", startedAt: string, endedAt?: string }[];
}