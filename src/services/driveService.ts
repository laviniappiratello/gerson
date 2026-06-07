import { Alert } from 'react-native';

export async function uploadParaDrive(access_token: string, historico: any[]): Promise<boolean> {
  try {
    const boundary = 'foo_bar_baz';
    const metadata = { name: 'backup_persephone.json', mimeType: 'application/json' };
    
    const body = 
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify(metadata) + `\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: application/json\r\n\r\n` +
      JSON.stringify(historico) + `\r\n` +
      `--${boundary}--`;

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${access_token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: body,
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Arquivo criado no Drive com ID:", result.id);
      return true;
    } else {
      console.error("Erro do Google:", result);
      return false;
    }
  } catch (error) {
    console.error("Erro no backup:", error);
    return false;
  }
}