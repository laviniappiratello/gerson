import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

// Recebe o 't' (função de tradução) como parâmetro
export async function exportarHistoricoPDF(dados: any[], t: any) {
  try {
    if (!dados || dados.length === 0) {
      Alert.alert(t('common.warning'), t('tiragem.noHistory'));
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: sans-serif; color: #333; }
            h1 { color: #880e4f; border-bottom: 2px solid #880e4f; }
            .tiragem { margin-bottom: 25px; page-break-inside: avoid; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>${t('tiragem.historyTitle')}</h1>
          ${dados.map((item, i) => `
            <div class="tiragem">
              <h3>${t('tiragem.reading')} #${i + 1}: ${item.question || item.pessoaNome || t('tiragem.noQuestion')}</h3>
              <p><strong>${t('tiragem.cards')}:</strong> ${item.cards ? item.cards.map((c: any) => c.nome).join(' • ') : t('tiragem.noData')}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    const file = await Print.printToFileAsync({ html: htmlContent, base64: false });
    
    if (file && file.uri) {
      await Sharing.shareAsync(file.uri, {
        dialogTitle: t('tiragem.shareHistory'),
        mimeType: 'application/pdf'
      });
    }
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    Alert.alert(t('common.error'), t('tiragem.pdfError'));
  }
}