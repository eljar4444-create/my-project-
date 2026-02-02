import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Count unread messages where the user is a participant (Client or Provider)
        // and is NOT the sender of the message.
        const unreadCount = await prisma.chatMessage.count({
            where: {
                isRead: false,
                senderId: { not: userId },
                request: {
                    OR: [
                        { clientId: userId },
                        { providerProfile: { userId: userId } }
                    ]
                }
            }
        });

        return NextResponse.json({ count: unreadCount });

    } catch (error) {
        console.error('Fetch unread count error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
