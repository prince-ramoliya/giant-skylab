"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSettings() {
    const settings = await db.settings.findFirst();
    if (!settings) {
        return await db.settings.create({
            data: {
                companyName: "My Company",
                companyGst: "",
                currencySymbol: "₹",
            },
        });
    }
    return settings;
}

export async function updateSettings(data: { companyName: string; companyGst?: string; companyAddress?: string }) {
    const settings = await getSettings();
    await db.settings.update({
        where: { id: settings.id },
        data: {
            companyName: data.companyName,
            companyGst: data.companyGst,
            companyAddress: data.companyAddress,
        },
    });
    revalidatePath("/settings");
    revalidatePath("/", "layout"); // Update global layout if company info is used there
}
