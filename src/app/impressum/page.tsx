import React from 'react';

export default function ImpressumPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl font-sans text-slate-900">
            <h1 className="text-3xl font-bold mb-8">Impressum</h1>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Angaben gemäß § 5 TMG</h2>
                <p className="text-gray-700 leading-relaxed mb-2">Eliar Mamedov</p>
                <p className="text-gray-700 leading-relaxed mb-2">Sophienstr. 22</p>
                <p className="text-gray-700 leading-relaxed mb-2">95444 Bayreuth</p>
                <p className="text-gray-700 leading-relaxed">Deutschland</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Kontakt</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                    <span className="font-semibold w-24 inline-block">Telefon:</span>
                    <a href="tel:+491722707002" className="hover:text-blue-600 transition-colors">+49 172 2707002</a>
                </p>
                <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold w-24 inline-block">E-Mail:</span>
                    <a href="mailto:eliar.mamedov@outlook.com" className="hover:text-blue-600 transition-colors">eliar.mamedov@outlook.com</a>
                </p>
            </section>
        </div>
    );
}
