import { api } from "./Api";

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: {
        name: string;
        email: string;
        role: "admin" | "user";
    };
}

export async function loginRequest(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);

    return response.data;
}
