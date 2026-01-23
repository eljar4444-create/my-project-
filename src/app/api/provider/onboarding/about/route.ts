import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
    bio: z.string().min(10, "Расскажите о себе немного подробнее"),
    imageUrl: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { bio, imageUrl } = schema.parse(body);

        // Update User image
        if (imageUrl) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { image: imageUrl },
            });
        }

        // Update Provider bio
        await prisma.providerProfile.update({
            where: { userId: session.user.id },
            data: { bio },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Profile update error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
