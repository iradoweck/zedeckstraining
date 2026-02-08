/**
 * Mock PDF Generator
 * In a real app, use @react-pdf/renderer or jsPDF.
 * For this prototype, we simulate generation or open a print window using a structured Template.
 */

const generateHTML = (type, data) => {
    const { title, date, amount, id, user } = data;

    // Styles
    const style = `
        <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; mx-auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563EB; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563EB; }
            .title { font-size: 32px; font-weight: bold; color: #1E293B; margin-bottom: 10px; }
            .meta { color: #64748B; font-size: 14px; }
            .box { background: #F8FAFC; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .amount { font-size: 24px; font-weight: bold; color: #2563EB; }
            table { w-full; border-collapse: collapse; margin-top: 20px; width: 100%; }
            th { text-align: left; color: #64748B; padding: 10px 0; border-bottom: 1px solid #E2E8F0; }
            td { padding: 15px 0; border-bottom: 1px solid #E2E8F0; }
            .footer { margin-top: 60px; text-align: center; color: #94A3B8; font-size: 12px; border-top: 1px solid #E2E8F0; padding-top: 20px; }
        </style>
    `;

    // Templates
    let content = '';

    if (type === 'Invoice') {
        content = `
            <div class="header">
                <div class="logo">ZTS</div>
                <div class="meta">
                    <p>Fatura #${id}</p>
                    <p>Data: ${date}</p>
                </div>
            </div>
            <div>
                <h1 class="title">Fatura Mensal</h1>
                <div class="box">
                    <p>Cliente: <strong>${user}</strong></p>
                    <p>Estado: <strong>Pendente</strong></p>
                </div>
                <table>
                    <thead><tr><th>Descrição</th><th>Qtd</th><th>Valor</th></tr></thead>
                    <tbody>
                        <tr><td>${title}</td><td>1</td><td>${amount}</td></tr>
                    </tbody>
                </table>
                <div style="text-align: right; margin-top: 20px;">
                    <p class="meta">Total a Pagar</p>
                    <div class="amount">${amount}</div>
                </div>
            </div>
        `;
    } else if (type === 'Receipt') {
        content = `
             <div class="header">
                <div class="logo">ZTS</div>
                <div class="meta">
                    <p>Recibo #${id}</p>
                    <p>Data: ${date}</p>
                </div>
            </div>
            <div style="text-align: center; margin: 40px 0;">
                <h1 class="title">Comprovativo de Pagamento</h1>
                <div style="width: 80px; height: 80px; background: #DCFCE7; color: #166534; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    ✓
                </div>
                 <div class="amount">${amount}</div>
                 <p class="meta">Pago via M-Pesa</p>
            </div>
             <div class="box">
                <p>Recebemos de <strong>${user}</strong> a quantia supra mencionada referente a <strong>${title}</strong>.</p>
            </div>
        `;
    }

    return `
        <html>
            <head><title>${title}</title>${style}</head>
            <body>
                ${content}
                <div class="footer">
                    <p>Zedeck's Training System - Processado digitalmente</p>
                </div>
            </body>
        </html>
    `;
};

export const downloadPDF = (doc, user = 'Estudante') => {
    // In a real app, this would use jsPDF to generate a binary and download it.
    // Here we open a print window for demonstration.
    const w = window.open('', '_blank');
    w.document.write(generateHTML(doc.type, { ...doc, user, amount: '4 500,00 MZN' }));
    w.document.close();
    // w.print(); // Optional: Auto print
};
