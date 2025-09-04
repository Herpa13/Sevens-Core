import Papa from 'papaparse';
import JSZip from 'jszip';

// Function to parse a CSV file content
export const parseCsv = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// Function to convert an array of objects to a CSV string
export const unparseCsv = (data: any[] | { fields: string[], data: any[] }): string => {
  return Papa.unparse(data);
};

// Function to trigger a download in the browser
export const triggerDownload = (content: string | Blob, fileName: string, mimeType: string) => {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


// Function to create a ZIP file from multiple CSV files
export const createZip = async (files: { name: string; content: string }[]): Promise<Blob> => {
    const zip = new JSZip();
    files.forEach(file => {
        zip.file(file.name, file.content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    return blob;
}