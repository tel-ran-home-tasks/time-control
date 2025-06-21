import {Request} from "express";

export enum Role {
    CREW = 'crew',
    MNG = 'manager',
    HR = 'hr',
    SUP = 'supervisor'
}

export interface AuthRequest extends Request{
    roles?: Role[];
    userId?: string;
}

export type LoginData = {
    id: string;
    password: string;
}

export type DateRangeQuery = {
    start: string;
    end: string;
};
