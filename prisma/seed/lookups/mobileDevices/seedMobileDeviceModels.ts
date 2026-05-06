import {PrismaClient} from "@/generated/prisma/client";


const MOBILE_DEVICE_MODELS = [
    "Apple iPhone 11",
    "Apple iPhone 14",
    "Apple iPhone 16",
    "Apple iPhone 16e",

    "Apple iPhone SE",
    "Apple iPhone SE 2nd Gen",
    "Apple iPhone SE 3rd Gen",

    "Office in a Box (OiaB)",

    "Qualcomm GSP-1700",

    "Samsung Galaxy A03s",
    "Samsung Galaxy A13",
    "Samsung Galaxy A14",
    "Samsung Galaxy A32",
    "Samsung Galaxy A54",
    "Samsung Galaxy A56",
    "Samsung Galaxy A57",

] as const

export async function seedMobileDeviceModels(prismaClient: PrismaClient) {
    await prismaClient.mobileDeviceModel.createMany({
        data: MOBILE_DEVICE_MODELS.map(name => ({name}))
    })
}
