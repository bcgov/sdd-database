import {revalidatePath} from "next/cache";
import {auth, currentUser} from "@clerk/nextjs/server";

type MockUser = {
    id: string;
    name: string;
}

export default async function MockUsers() {

    const authObj = await auth();
    const userObj = await currentUser();

    console.log({authObj, userObj});

    const response = await fetch("https://676b6d6cbc36a202bb84b552.mockapi.io/users");

    const data: MockUser[] = await response.json();

    async function addUser(formData: FormData) {
        "use server"

        const name = formData.get("name");

        const response = await fetch("https://676b6d6cbc36a202bb84b552.mockapi.io/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name})
        })

        revalidatePath("/mock-users");

        // const newUser = await response.json();
    }

    return (
        <div className="py-10">
            <form action={addUser} className="mb-4">
                <input type="text" name="name" required className="border p-2 mr-2"/>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
            </form>
            <div className="grid grid-cols-4 gap-4 py-10">
                {data.map((user) => (
                    <div key={user.id} className="p-4 bg-white shadow-md rounded-lg text-gray-700"> {user.name}</div>
                ))}
            </div>
        </div>
    )
}