"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSuppliers() {
    return await db.supplier.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function createSupplier(data: { name: string; gst?: string; contact?: string; address?: string }) {
    await db.supplier.create({
        data: {
            name: data.name,
            gst: data.gst,
            contact: data.contact,
            address: data.address,
        },
    });
    revalidatePath("/", "layout");
}

export async function updateSupplier(id: string, data: { name: string; gst?: string; contact?: string }) {
    await db.supplier.update({
        where: { id },
        data: {
            name: data.name,
            gst: data.gst,
            contact: data.contact,
        },
    });
    revalidatePath("/", "layout");
}

export async function toggleSupplierStatus(id: string, active: boolean) {
    await db.supplier.update({
        where: { id },
        data: { active },
    });
    revalidatePath("/", "layout");
}
