import { BACKEND_URL } from "./env";

export type University = { id: number, name: string };

export async function getUniversities() {
    const res = await fetch(`${BACKEND_URL}/api/universities`, {
        method: 'GET',
    });

    if (res.status === 200) {
        return await res.json() as Array<University>;
    }

    return [];
}