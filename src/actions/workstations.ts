"use server";

import {Workstation} from "@prisma/client";

import {addNewWorkstation} from "@/prisma-db";


export async function addNewWorkstationAction(workstation: Workstation) {
    await addNewWorkstation(workstation);
}
