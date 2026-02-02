'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Calendar, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Request {
    id: string;
    message: string;
    createdAt: string;
    status: string;
    client: {
        name: string | null;
        image: string | null;
        email: string | null;
    };
    service: {
        title: string;
    };
}

export default function RequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('/api/requests');
                setRequests(response.data.requests);
            } catch (err) {
                console.error('Error fetching requests:', err);
                setError('Не удалось загрузить запросы');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-2xl font-bold mb-6">Входящие запросы</h1>

            {requests.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">У вас пока нет новых запросов</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div key={req.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    {req.client.image ? (
                                        <img
                                            src={req.client.image}
                                            alt={req.client.name || 'Client'}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{req.client.name || req.client.email || 'Пользователь'}</h3>
                                        <p className="text-sm text-gray-500">Интересуется: {req.service.title}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {req.status === 'PENDING' ? 'Новый' : req.status}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(req.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
                                {req.message}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <a
                                    href={`mailto:${req.client.email}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                >
                                    Ответить по Email
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
