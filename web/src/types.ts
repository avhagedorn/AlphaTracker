export interface UserResponse {
    username: string;
    email: string;
    created_at: string;
    is_admin: boolean;
}

export interface PositionRow {
    ticker: string;
    equity: number;
    equityValueDollars: number;
    return: number;
    returnValueDollars: number;
    alpha: number;
    alphaValueDollars: number;
}
