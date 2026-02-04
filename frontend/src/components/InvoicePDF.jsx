import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { formatCurrency } from '../utils/formatters';

// Register Inter font (using standard fonts for now to ensure compatibility, or register standard fonts)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: '20mm',
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 20,
    marginBottom: 20,
  },
  logoSection: {
    width: '50%',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F4ED8', // Primary Blue
  },
  subLogoText: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 4,
  },
  invoiceMeta: {
    width: '50%',
    alignItems: 'flex-end',
  },
  docTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  metaLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginRight: 8,
  },
  metaValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
  },

  // Student Info Block
  infoBlock: {
    backgroundColor: '#F9FAFB', // Very Light Gray
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoCol: {
    width: '50%',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 8,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },

  // Acedemic Details
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F4ED8',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
    paddingBottom: 4,
  },
  academicBlock: {
    marginBottom: 20,
    paddingLeft: 4,
  },

  // Payment Table
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF', // Light Blue
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  th: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1E40AF',
    textTransform: 'uppercase',
  },
  td: {
    fontSize: 9,
    color: '#374151',
  },
  colItem: { width: '40%' },
  colDesc: { width: '25%' },
  colQty: { width: '10%', textAlign: 'center' },
  colUnit: { width: '15%', textAlign: 'right' },
  colSubtotal: { width: '15%', textAlign: 'right' },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F4ED8',
  },

  // Methods & Validity
  bottomGrid: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
  column: {
    flex: 1,
  },
  methodsList: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.6,
  },

  // Validity Box
  validityBox: {
    borderWidth: 1,
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  validityText: {
    fontSize: 9,
    color: '#92400E',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Notes
  notesContainer: {
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  noteText: {
    fontSize: 8,
    color: '#9CA3AF', // Gray 400
    fontStyle: 'italic',
    marginBottom: 2,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
  },
});

const InvoicePDF = ({ studentData, paymentData }) => {
  // Generate Metadata
  const issueDate = new Date().toLocaleDateString('pt-MZ');
  // Deterministic suffix based on student code length or date to avoid random
  const suffix = (studentData.student_code ? studentData.student_code.replace(/[^0-9]/g, '').slice(-4) : '0000');
  const docNumber = `ZTS-GP-${new Date().getFullYear()}-${suffix}`;

  const { breakdown } = paymentData;
  const paymentRef = paymentData.reference || "N/A";

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* 1. Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            <Text style={styles.logoText}>Zedeck's Training</Text>
            <Text style={styles.subLogoText}>Plataforma Académica ZTS</Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.docTitle}>GUIA DE PAGAMENTO</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Documento Nº:</Text>
              <Text style={styles.metaValue}>{docNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Data de Emissão:</Text>
              <Text style={styles.metaValue}>{issueDate}</Text>
            </View>
          </View>
        </View>

        {/* 2. Student Info */}
        <View style={styles.infoBlock}>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.fieldLabel}>Nome Completo</Text>
              <Text style={styles.fieldValue}>{studentData.name}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.fieldLabel}>ID do Estudante</Text>
              <Text style={styles.fieldValue}>{studentData.student_code}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.fieldLabel}>Referência de Pagamento</Text>
              <Text style={{ ...styles.fieldValue, color: '#1F4ED8' }}>{paymentRef}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.fieldLabel}>Estado da Inscrição</Text>
              <Text style={styles.fieldValue}>Pré-matrícula</Text>
            </View>
          </View>
        </View>

        {/* 3. Academic Details */}
        <View style={styles.academicBlock}>
          <Text style={styles.sectionTitle}>Detalhes Académicos</Text>
          {studentData.courses && studentData.courses.map((course, idx) => (
            <View key={idx} style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold' }}>• {course.title}</Text>
              <Text style={{ fontSize: 9, color: '#6B7280', marginLeft: 6 }}>
                Modalidade: {course.modality === 'online' ? 'Online' : 'Presencial'} | Duração Estimada: {course.duration || 'N/A'} meses
              </Text>
            </View>
          ))}
        </View>

        {/* 4. Payment Details Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colItem]}>Item</Text>
            <Text style={[styles.th, styles.colDesc]}>Descrição</Text>
            <Text style={[styles.th, styles.colQty]}>Qtd</Text>
            <Text style={[styles.th, styles.colUnit]}>Unitário</Text>
            <Text style={[styles.th, styles.colSubtotal]}>Subtotal</Text>
          </View>
          {breakdown.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.td, styles.colItem]}>{item.name || 'Mensalidade/Inscrição'}</Text>
              <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
              <Text style={[styles.td, styles.colQty]}>{item.qty}</Text>
              <Text style={[styles.td, styles.colUnit]}>{formatCurrency(item.unit_price)}</Text>
              <Text style={[styles.td, styles.colSubtotal]}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Geral</Text>
            <Text style={styles.totalValue}>{formatCurrency(breakdown.total)}</Text>
          </View>
        </View>

        {/* 5. Bottom Info */}
        <View style={styles.bottomGrid}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Métodos de Pagamento</Text>
            <Text style={styles.methodsList}>• M-Pesa</Text>
            <Text style={styles.methodsList}>• e-Mola</Text>
            <Text style={styles.methodsList}>• Stripe / Cartão</Text>
            <Text style={styles.methodsList}>• Depósito ou Transferência Bancária</Text>
            <Text style={{ fontSize: 8, fontStyle: 'italic', marginTop: 4, color: '#6B7280' }}>
              O pagamento pode ser feito de forma automática ou manual.
            </Text>
          </View>
          <View style={styles.column}>
            <View style={styles.validityBox}>
              <Text style={styles.validityText}>VALIDADE: 15 DIAS APÓS A EMISSÃO</Text>
            </View>
          </View>
        </View>

        {/* 6. Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.noteText}>Este documento não serve como recibo definitivo.</Text>
          <Text style={styles.noteText}>A confirmação da inscrição está sujeita à validação do pagamento pela Zedeck's Training.</Text>
        </View>

        {/* 7. Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} Zedeck's Training</Text>
          <Text style={styles.footerText}>Documento gerado automaticamente pelo ZTS</Text>
        </View>

      </Page>
    </Document>
  );
};

export default InvoicePDF;
