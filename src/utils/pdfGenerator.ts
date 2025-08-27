import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FPSData {
  fps_number: string;
  fps_key: string;
  license_plate: string;
  fps_amount: string;
  service_fees: string;
  total_amount: string;
  payment_method: string;
  session_id?: string;
}

export const generateReceiptPDF = async (fpsData: FPSData): Promise<Blob> => {
  try {
    // Create a temporary container for the receipt HTML
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '800px';
    container.style.background = 'white';
    document.body.appendChild(container);

    // Generate the receipt HTML
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-receipt-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        session_id: fpsData.session_id,
        fps_data: fpsData
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate receipt HTML');
    }

    const { html } = await response.json();
    container.innerHTML = html;

    // Wait for any fonts or images to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: container.scrollHeight
    });

    // Clean up
    document.body.removeChild(container);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

    // Return PDF as blob
    return pdf.output('blob');

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Impossible de générer le justificatif PDF');
  }
};

export const downloadReceiptPDF = async (fpsData: FPSData) => {
  try {
    const pdfBlob = await generateReceiptPDF(fpsData);
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `justificatif-fps-${fpsData.fps_number}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};