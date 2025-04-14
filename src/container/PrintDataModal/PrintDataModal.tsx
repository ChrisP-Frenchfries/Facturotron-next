"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PrintDataModalProps {
    data: Array<{ invoiceId: number;[key: string]: string | number }>;
    onClose: () => void;
}

export default function PrintDataModal({ data, onClose }: PrintDataModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Factures prêtes à imprimer</h2>
                {data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 text-center">ID Facture</th>
                                    {Object.keys(data[0])
                                        .filter((key) => key !== "invoiceId")
                                        .map((key) => (
                                            <th key={key} className="border border-gray-300 p-2 text-center">
                                                {key}
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row) => (
                                    <tr key={row.invoiceId}>
                                        <td className="border border-gray-300 p-2 text-center">{row.invoiceId}</td>
                                        {Object.entries(row)
                                            .filter(([key]) => key !== "invoiceId")
                                            .map(([key, value]) => (
                                                <td key={key} className="border border-gray-300 p-2 text-center">
                                                    {value}
                                                </td>
                                            ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">Aucune donnée à afficher.</p>
                )}
                <Button
                    onClick={onClose}
                    className="mt-4 bg-red-500 hover:bg-red-600"
                >
                    Fermer
                </Button>
            </div>
        </div>
    );
}