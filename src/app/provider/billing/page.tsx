'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function BillingPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Provider Subscription</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-2 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardHeader>
                        <CardTitle>Basic Plan</CardTitle>
                        <div className="text-3xl font-bold mt-2">$0 <span className="text-sm font-normal text-gray-500">/month</span></div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2"><Check className="text-green-500 w-5 h-5" /> Create 1 Service Profile</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 w-5 h-5" /> Basic Visibility</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 w-5 h-5" /> Email Support</li>
                        </ul>
                        <Button className="w-full mt-6" variant="outline">Current Plan</Button>
                    </CardContent>
                </Card>

                <Card className="border-2 border-blue-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">RECOMMENDED</div>
                    <CardHeader>
                        <CardTitle>Pro Plan</CardTitle>
                        <div className="text-3xl font-bold mt-2">$29 <span className="text-sm font-normal text-gray-500">/month</span></div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2"><Check className="text-green-500 w-5 h-5" /> Unlimited Service Profiles</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 w-5 h-5" /> Priority Search Listing</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 w-5 h-5" /> Direct Messaging</li>
                            <li className="flex items-center gap-2"><Check className="text-green-500 w-5 h-5" /> Analytics Dashboard</li>
                        </ul>
                        <Button className="w-full mt-6">Upgrade to Pro</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
