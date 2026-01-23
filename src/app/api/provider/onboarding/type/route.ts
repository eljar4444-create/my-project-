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

        const profile = await prisma.providerProfile.update({
            where: { userId: session.user.id },
            data: {
                type,
            },
        });

        return NextResponse.json({ success: true, profile });
    } catch (error: any) {
        console.error("Onboarding type error:", error);
        return NextResponse.json(
            { error: "Error updating profile type", details: error.message },
            { status: 500 }
        );
    }
}
