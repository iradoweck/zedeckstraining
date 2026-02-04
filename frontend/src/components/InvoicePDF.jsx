import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register Inter font (or standard fonts)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#1F2937'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 20
  },
  logoSection: {
    width: '40%'
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF', // ZTS Blue
    textTransform: 'uppercase'
  },
  logoSubtext: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 4
  },
  invoiceDetails: {
    textAlign: 'right'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  label: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8
  },
  studentSection: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 4
  },
  col: {
    flex: 1
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 30
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
    alignItems: 'center'
  },
  tableHeader: {
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  cellDesc: { width: '50%', paddingLeft: 8 },
  cellQty: { width: '15%', textAlign: 'center' },
  cellPrice: { width: '15%', textAlign: 'right' },
  cellTotal: { width: '20%', textAlign: 'right', paddingRight: 8 },
  bold: { fontWeight: 'bold' },

  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 40
  },
  totalBox: {
    width: '40%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  finalTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 8,
    textAlign: 'center',
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20
  },
  refBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    textAlign: 'center'
  },
  refText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    letterSpacing: 2
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(value);
};

const InvoicePDF = ({ studentData, paymentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>Zedeck Training</Text>
          <Text style={styles.logoSubtext}>System (ZTS)</Text>
          <Text style={{ marginTop: 10, fontSize: 9 }}>Av. do Trabalho, entrada da STEIA, Jamila</Text>
          <Text style={{ fontSize: 9 }}>Cidade de Nampula, Moçambique</Text>
          <Text style={{ fontSize: 9, marginTop: 4 }}>+258 86 613 3052 | training@zedecks.com</Text>
          <Text style={{ fontSize: 9 }}>training.zedecks.com</Text>
        </View>
        <View style={styles.invoiceDetails}>
          <Text style={styles.title}>Guia de Pagamento</Text>
          <Text style={styles.label}>Data de Emissão:</Text>
          <Text style={styles.value}>{new Date().toLocaleDateString('pt-MZ')}</Text>
          <Text style={styles.label}>Válido até:</Text>
          <Text style={styles.value}>{new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-MZ')}</Text>
        </View>
      </View>

      {/* Student Info */}
      <View style={styles.studentSection}>
        <View style={styles.col}>
          <Text style={styles.label}>Estudante:</Text>
          <Text style={styles.value}>{studentData.name}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>ID do Estudante:</Text>
          <Text style={styles.value}>{studentData.student_code}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Documento:</Text>
          <Text style={styles.value}>{studentData.doc_number}</Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.cellDesc, styles.bold]}>Descrição</Text>
          <Text style={[styles.cellQty, styles.bold]}>Qtd</Text>
          <Text style={[styles.cellPrice, styles.bold]}>Preço Unit.</Text>
          <Text style={[styles.cellTotal, styles.bold]}>Total</Text>
        </View>

        {paymentData.breakdown.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.cellDesc}>{item.description}</Text>
            <Text style={styles.cellQty}>{item.qty}</Text>
            <Text style={styles.cellPrice}>{formatCurrency(item.unit_price)}</Text>
            <Text style={styles.cellTotal}>{formatCurrency(item.total)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalSection}>
        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>{formatCurrency(paymentData.breakdown.total)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Taxas (0%):</Text>
            <Text>{formatCurrency(0)}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text>TOTAL A PAGAR:</Text>
            <Text>{formatCurrency(paymentData.breakdown.total)}</Text>
          </View>
        </View>
      </View>

      {/* Payment Reference */}
      <View style={styles.refBox}>
        <Text style={{ marginBottom: 5, fontSize: 10, color: '#1E40AF' }}>REFERÊNCIA DE PAGAMENTO UNICA</Text>
        <Text style={styles.refText}>{paymentData.reference}</Text>
      </View>

      {/* Bank Info (Static for now, could be dynamic) */}
      <View style={{ marginTop: 30 }}>
        <Text style={[styles.bold, { marginBottom: 10 }]}>Dados Bancários para Transferência:</Text>
        <Text>Banco: Millennium BIM</Text>
        <Text>Conta: 123456789</Text>
        <Text>NIB: 0001 0000 1234 5678 9012 3</Text>
        <Text>Titular: Zedeck's Training System</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Documento processado eletronicamente pelo ZTS. Válido sem assinatura e carimbo.</Text>
        <Text>Zedeck Training System © 2026. Todos os direitos reservados.</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
