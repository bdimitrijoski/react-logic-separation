import { HttpClient } from "../boundaries";

export class FetchHttpClient implements HttpClient {
    async get<T>(url: string): Promise<T> {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Failed to fetch");
        return resp.json();
    }
    async post<DTO, T>(url: string, data: DTO): Promise<T> {
        const resp = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!resp.ok) throw new Error("Failed to post");
        return resp.json();
    }
    async put<DTO, T>(url: string, data: DTO): Promise<T> {
        const resp = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!resp.ok) throw new Error("Failed to put");
        return resp.json();
    }
    async delete(url: string): Promise<void> {
        const resp = await fetch(url, { method: "DELETE" });
        if (!resp.ok) throw new Error("Failed to delete");
    }
}