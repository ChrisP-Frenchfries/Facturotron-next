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
            <div className="bg-[#E6F2E1] rounded-lg w-full h-full overflow-auto p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-[#2C5530] mb-4">Factures prêtes à imprimer</h2>
                {data.length > 0 ? (
                    <div className="flex-grow overflow-x-auto">
                        <table className="w-full border-collapse border border-[#B8D8BA]">
                            <thead>
                                <tr>
                                    <th className="border border-[#B8D8BA] p-2 text-center text-[#2C5530] font-semibold bg-[#E6F2E1] sticky top-0">ID Facture</th>
                                    {uniqueKeys.map((key) => (
                                        <th key={key} className="border border-[#B8D8BA] p-2 text-center text-[#2C5530] font-semibold bg-[#E6F2E1] sticky top-0">
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row) => (
                                    <tr key={row.invoiceId}>
                                        <td className="border border-[#B8D8BA] p-2 text-center text-[#2C5530]">{row.invoiceId}</td>
                                        {uniqueKeys.map((key) => (
                                            <td key={key} className="border border-[#B8D8BA] p-2 text-center text-[#2C5530]">
                                                {row[key] ?? "-"}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-[#2C5530] opacity-70">Aucune donnée à afficher.</p>
                )}
                <Button
                    onClick={onClose}
                    className="mt-4 px-4 py-1.5 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200 self-end"
                >
                    Fermer
                </Button>
            </div>
        </div>
    );
}