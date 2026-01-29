import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminDashboard() {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/');
    }

    const [userCount, serviceCount, services, users] = await Promise.all([
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
            take: 20
        }),
        prisma.user.findMany({
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

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Users List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Последние регистрации</h2>
                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Имя</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Роль</TableHead>
                                    <TableHead>Дата</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.image && <img src={user.image} className="w-6 h-6 rounded-full inline-block mr-2" />}
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{user.email}</TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-bold",
                                                user.role === 'ADMIN' ? "bg-red-100 text-red-700" :
                                                    user.role === 'PROVIDER' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                                            )}>
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Services List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Последние услуги</h2>
                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Название</TableHead>
                                    <TableHead>Автор</TableHead>
                                    <TableHead>Цена</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className="font-medium">{service.title}</TableCell>
                                        <TableCell className="text-xs">
                                            {service.providerProfile.user.name}
                                        </TableCell>
                                        <TableCell className="text-xs">{service.price} €</TableCell>
                                    </TableRow>
                                ))}
                                {services.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">Нет услуг</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper for class names since I used `cn` in the code above but forgot if it was imported.
// Checking imports... `import { redirect } from "next/navigation";` 
// I need `import { cn } from "@/lib/utils";` which is NOT imported in original file!
// Wait, `cn` IS NOT imported. I must add the import or remove `cn`.
// I will add the import in a separate block if I can, or use string interpolation.
// Actually, easier to use template literals for now to avoid import errors if I can't multi-edit.
// `className={\`px-2 py-1 rounded-full text-xs font-bold \${user.role === 'ADMIN' ? "bg-red-100 text-red-700" : user.role === 'PROVIDER' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}\`}`

