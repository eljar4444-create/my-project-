import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const schema = z.object({
    type: z.enum(["PRIVATE", "SALON"]),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { type } = schema.parse(body);

        // Use a transaction to ensure both operations succeed or fail together
        const result = await prisma.$transaction(async (tx) => {
            // 1. Upsert ProviderProfile (create if not exists, update if exists)
            const profile = await tx.providerProfile.upsert({
                where: { userId: session.user.id },
                create: {
                    userId: session.user.id!,
                    type,
                    rating: 0,
                    reviewCount: 0,
                    verificationStatus: "IDLE"
                },
                update: {
                    type,
                },
            });

            // 2. Ensure User role is PROVIDER
            // Only update if not already PROVIDER or ADMIN to avoid downgrading admins
            const currentUser = await tx.user.findUnique({
                where: { id: session.user.id },
                select: { role: true }
            });

            if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'PROVIDER') {
                await tx.user.update({
                    where: { id: session.user.id },
                    data: { role: 'PROVIDER' }
                });
            }

            return profile;
        });

        return NextResponse.json({ success: true, profile: result });
    } catch (error: any) {
        console.error("Onboarding type error:", error);
        return NextResponse.json(
            { error: "Error updating profile type", details: error.message },
            { status: 500 }
        );
    }
}
