/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#1e293b",
        backgroundColor: "#ffffff",
    },
    header: {
        marginBottom: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    brandBrand: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4f46e5",
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    brandSub: {
        fontSize: 10,
        color: "#64748b",
    },
    metaBox: {
        marginTop: 10,
        textAlign: "right",
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 4,
    },
    metaLabel: {
        color: "#64748b",
        marginRight: 8,
        width: 60,
        textAlign: "right",
    },
    metaValue: {
        fontWeight: "bold",
        textAlign: "right",
    },
    addressWithId: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    addressBox: {
        width: "45%",
    },
    addressTitle: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#64748b",
        marginBottom: 8,
        textTransform: "uppercase",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingBottom: 4,
    },
    addressText: {
        fontSize: 10,
        lineHeight: 1.5,
        color: "#334155",
    },
    table: {
        marginTop: 10,
        width: "100%",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 4,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    tableHeaderCell: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#475569",
        textTransform: "uppercase",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    tableCell: {
        fontSize: 10,
        color: "#334155",
    },
    col1: { width: "50%" },
    col2: { width: "15%", textAlign: "right" },
    col3: { width: "15%", textAlign: "right" },
    col4: { width: "20%", textAlign: "right" },
    totalsSection: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    totalsBox: {
        width: "40%",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
        paddingHorizontal: 8,
    },
    totalLabel: {
        color: "#64748b",
    },
    totalValue: {
        fontWeight: "bold",
        color: "#0f172a",
    },
    grandTotal: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopColor: "#4f46e5",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8,
    },
    grandTotalLabel: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#4f46e5",
    },
    grandTotalValue: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#4f46e5",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        color: "#94a3b8",
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: "#f1f5f9",
        paddingTop: 10,
    },
});

interface BillDocumentProps {
    data: any;
    month: Date;
    supplier: {
        name: string;
        gst: string | null;
        address: string | null;
        contact: string | null;
    };
    settings: {
        companyName: string;
        companyGst: string | null;
        companyAddress: string | null;
    };
}

export function BillDocument({ data, month, supplier, settings }: BillDocumentProps) {
    const { categoryBreakdown, summary } = data;
    const categories = Object.keys(categoryBreakdown).map((key) => ({
        name: key,
        ...categoryBreakdown[key],
    }));

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brandBrand}>{settings.companyName}</Text>
                        <Text style={styles.brandSub}>GSTIN: {settings.companyGst || "N/A"}</Text>
                        <Text style={styles.brandSub}>{settings.companyAddress || ""}</Text>
                    </View>
                    <View style={styles.metaBox}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#cbd5e1', marginBottom: 5 }}>INVOICE</Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Date:</Text>
                            <Text style={styles.metaValue}>{format(new Date(), "dd MMM yyyy")}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Month:</Text>
                            <Text style={styles.metaValue}>{format(month, "MMMM yyyy")}</Text>
                        </View>
                    </View>
                </View>

                {/* Addresses */}
                <View style={styles.addressWithId}>
                    <View style={styles.addressBox}>
                        <Text style={styles.addressTitle}>Billed To</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>{supplier.name}</Text>
                        {supplier.address && <Text style={styles.addressText}>{supplier.address}</Text>}
                        {supplier.gst && <Text style={styles.addressText}>GSTIN: {supplier.gst}</Text>}
                        {supplier.contact && <Text style={styles.addressText}>Phone: {supplier.contact}</Text>}
                    </View>
                    <View style={styles.addressBox}>
                        {/* Can put shipping info here if different */}
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, styles.col1]}>Item Description</Text>
                        <Text style={[styles.tableHeaderCell, styles.col2]}>Rate</Text>
                        <Text style={[styles.tableHeaderCell, styles.col3]}>Qty</Text>
                        <Text style={[styles.tableHeaderCell, styles.col4]}>Amount</Text>
                    </View>

                    {categories.map((cat: any) => (
                        <View key={cat.name} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.col1]}>{cat.name}</Text>
                            <Text style={[styles.tableCell, styles.col2]}>{cat.price.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, styles.col3]}>{cat.quantity}</Text>
                            <Text style={[styles.tableCell, styles.col4]}>{cat.amount.toFixed(2)}</Text>
                        </View>
                    ))}

                    <View style={[styles.tableRow, { backgroundColor: '#f8fafc' }]}>
                        <Text style={[styles.tableCell, styles.col1, { fontWeight: 'bold' }]}>Subtotal</Text>
                        <Text style={[styles.tableCell, styles.col2]}></Text>
                        <Text style={[styles.tableCell, styles.col3, { fontWeight: 'bold' }]}>{summary.totalPieces}</Text>
                        <Text style={[styles.tableCell, styles.col4, { fontWeight: 'bold' }]}>{summary.grossAmount.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Returns */}
                {summary.totalReturnsAmount > 0 && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ef4444', marginBottom: 5 }}>LESS: RETURNS</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.col1]}>Returned Items</Text>
                                <Text style={[styles.tableCell, styles.col2]}>-</Text>
                                <Text style={[styles.tableCell, styles.col3]}>{summary.totalReturnsQty}</Text>
                                <Text style={[styles.tableCell, styles.col4, { color: '#ef4444' }]}>-{summary.totalReturnsAmount.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Totals Block */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Gross Amount</Text>
                            <Text style={styles.totalValue}>{summary.grossAmount.toFixed(2)}</Text>
                        </View>
                        {summary.totalReturnsAmount > 0 && (
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Returns</Text>
                                <Text style={[styles.totalValue, { color: '#ef4444' }]}>-{summary.totalReturnsAmount.toFixed(2)}</Text>
                            </View>
                        )}
                        <View style={styles.grandTotal}>
                            <Text style={styles.grandTotalLabel}>TOTAL PAYABLE</Text>
                            <Text style={styles.grandTotalValue}>₹{summary.netPayable.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Thank you for your business!</Text>
                    <Text>This is a computer-generated invoice.</Text>
                </View>
            </Page>
        </Document>
    );
}
