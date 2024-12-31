"use client";

import {useState, useEffect} from "react";

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
}

export default function UsersClient() {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {

                await new Promise((resolve) => setTimeout(resolve, 2000))

                const response = await fetch("https://jssonplaceholder.typicode.com/users");

                if (!response.ok) throw new Error("Failed to fetch users");

                const data = await response.json();

                setUsers(data);

            } catch (error) {
                setError("Failed to fetch users.");

                if (error instanceof Error) {
                    setError(`Failed to fetch users: ${error.message}`);
                }

            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <ul className="space-y-4 p-4">
            {users.map((user) => (
                <li key={user.id}
                    className="p-4 bg-white shadow-md rounded-lg text-grey-700">{user.name} ({user.email})</li>
            ))}
        </ul>
    )
}