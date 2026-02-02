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

        const user = session.user;
        let whereCondition = {};

        if (user.role === 'PROVIDER') {
            const providerProfile = await prisma.providerProfile.findUnique({
                where: { userId: user.id } // Use userId for lookup
            });

            if (!providerProfile) {
                return NextResponse.json({ requests: [] });
            }

            whereCondition = { providerProfileId: providerProfile.id };
        } else {
            whereCondition = { clientId: user.id };
        }

        const requests = await prisma.request.findMany({
            where: whereCondition,
            include: {
                client: {
                    select: { name: true, image: true, email: true }
                },
                providerProfile: {
                    include: {
                        user: { select: { name: true, image: true, email: true } }
                    }
                },
                service: {
                    select: { title: true }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                isRead: false,
                                senderId: { not: user.id }
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Format for easy frontend consumption
        const formattedRequests = requests.map((req: any) => ({
            id: req.id,
            serviceTitle: req.service.title,
            updatedAt: req.updatedAt,
            lastMessage: req.messages[0]?.content || req.message, // Fallback to initial message
            unreadCount: req._count.messages,
            interlocutor: user.role === 'PROVIDER'
                ? {
                    name: req.client.name || req.client.email,
                    image: req.client.image,
                    email: req.client.email
                }
                : {
                    name: req.providerProfile.user.name,
                    image: req.providerProfile.user.image,
                    email: req.providerProfile.user.email
                }
        }));

        return NextResponse.json({ requests: formattedRequests });

    } catch (error) {
        console.error('Fetch chats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
