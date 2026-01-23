import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Briefcase } from "lucide-react";

export default async function AdminDashboard() {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/');
    }

    const [userCount, serviceCount, services] = await Promise.all([
        prisma.user.count(),
        prisma.service.count(),
        prisma.service.findMany({
            include: {
                providerProfile: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        })
    ]);

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>

            <div className="grid gap-6 md:grid-cols-2 mb-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Опубликованных услуг</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{serviceCount}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold">Лента услуг (Последние 50)</h2>
                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead>Исполнитель</TableHead>
                                <TableHead>Цена</TableHead>
                                <TableHead>Дата</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.title}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{service.providerProfile.user.name}</span>
                                            <span className="text-xs text-muted-foreground">{service.providerProfile.user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{service.price} €</TableCell>
                                    <TableCell>{new Date(service.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                            {services.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Нет опубликованных услуг</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
