import {users} from "../route"

export async function GET(_request: Request, context: { params: { id: string } }) {

    const {id} = await context.params;

    const user = users.find(user => user.id === parseInt(id));

    return Response.json(user);
}