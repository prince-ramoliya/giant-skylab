"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { BillDocument } from "@/components/pdf/BillDocument";
import { FileDown, Loader2 } from "lucide-react";

// Import PDFDownloadLink dynamically to avoid SSR issues with react-pdf
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => (
            <Button disabled variant="outline">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading PDF...
            </Button>
        ),
    }
);

interface DownloadPDFButtonProps {
    data: any;
    month: Date;
    supplier: {
        name: string;
        gst: string | null;
        contact: string | null;
        address: string | null;
    };
    settings: {
        companyName: string;
        companyGst: string | null;
        companyAddress: string | null;
    };
}

export function DownloadPDFButton({ data, month, supplier, settings }: DownloadPDFButtonProps) {
    return (
        <PDFDownloadLink
            document={<BillDocument data={data} month={month} supplier={supplier} settings={settings} />}
            fileName={`Bill_${supplier.name.replace(/\s+/g, "_")}_${month.toISOString().slice(0, 7)}.pdf`}
        >
            {({ loading }) => (
                <Button disabled={loading}>
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <FileDown className="mr-2 h-4 w-4" />
                    )}
                    Download PDF
                </Button>
            )}
        </PDFDownloadLink>
    );
}
