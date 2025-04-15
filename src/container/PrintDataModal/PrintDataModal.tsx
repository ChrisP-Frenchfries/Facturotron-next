"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PrintDataModalProps {
    data: Array<{ invoiceId: number;[key: string]: string | number }>;
    onClose: () => void;
}

export default function PrintDataModal({ data, onClose }: PrintDataModalProps) {
    // Collecter toutes les clés uniques (sauf invoiceId)
    const uniqueKeys = Array.from(
        new Set(
            data.flatMap((row) =>
                Object.keys(row).filter((key) => key !== "invoiceId")
            )
        )
    );

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
                                    {uniqueKeys.map((key) => (
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
                                        {uniqueKeys.map((key) => (
                                            <td key={key} className="border border-gray-300 p-2 text-center">
                                                {row[key] ?? "-"}
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