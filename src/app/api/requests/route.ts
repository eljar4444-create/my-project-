import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const RequestSchema = z.object({
    serviceId: z.string(),
    clientId: z.string(),
    providerId: z.string(), // This might be providerUserId passing from frontend
    message: z.string().min(5),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = RequestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
        }

        const { serviceId, clientId, message } = result.data;

        // We need to fetch the service to get the correct providerProfileId
        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        });

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        const request = await prisma.request.create({
            data: {
                serviceId,
                clientId,
                providerProfileId: service.providerProfileId,
                message,
                status: 'PENDING'
            },
        });

        return NextResponse.json({ success: true, request });

    } catch (error) {
        console.error('Create request error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
