import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["CLIENT", "PROVIDER"]),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role } = schema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Пользователь с таким email уже существует" }, // User exists
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const finalName = name || email.split('@')[0];

        const user = await prisma.user.create({
            data: {
                name: finalName,
                email,
                password: hashedPassword,
                role,
            },
        });

        // If provider, create profile
        if (role === 'PROVIDER') {
            await prisma.providerProfile.create({
                data: {
                    userId: user.id
                }
            })
        }

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Error creating user", details: error.message },
            { status: 500 }
        );
    }
}
