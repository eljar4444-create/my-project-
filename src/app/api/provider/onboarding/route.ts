import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const schema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { firstName, lastName } = schema.parse(body);

        const fullName = `${firstName} ${lastName}`;

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: fullName,
            },
        });

        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        console.error("Onboarding error:", error);
        return NextResponse.json(
            { error: "Error updating profile", details: error.message },
            { status: 500 }
        );
    }
}
