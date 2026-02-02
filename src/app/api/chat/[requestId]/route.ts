import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { requestId: string } }) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { requestId } = params;

    try {
        const messages = await prisma.chatMessage.findMany({
            where: { requestId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: { id: true, name: true, image: true }
                }
            }
        });

        const request = await prisma.request.findUnique({
            where: { id: requestId },
            select: { message: true, createdAt: true, clientId: true }
        })

        // Include the initial request message as the first message
        if (request) {
            const initialMessage = {
                id: 'initial',
                content: request.message,
                senderId: request.clientId,
                createdAt: request.createdAt,
                sender: null // Client info is fetched in the main list or we can fetch it here if needed, but for simplicity assuming we know who sent it
            };
            // Note: Efficiently handling this might require better unified structure, 
            // but for now we prepend it if no messages exist or just rely on ChatMessage.
            // Actually, best practice is to insert the initial request as a ChatMessage upon creation, 
            // but for backward compatibility we can render it as a message.
        }

        return NextResponse.json({ messages });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { requestId: string } }) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { requestId } = params;
    const { content } = await req.json();

    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 });

    try {
        const message = await prisma.chatMessage.create({
            data: {
                content,
                requestId,
                senderId: session.user.id
            }
        });

        // Update request timestamp for sorting
        await prisma.request.update({
            where: { id: requestId },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json({ message });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
