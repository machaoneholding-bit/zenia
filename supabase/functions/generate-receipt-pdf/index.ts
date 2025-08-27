import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { session_id, fps_data } = await req.json();

    if (!session_id || !fps_data) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate PDF content as HTML
    const pdfHtml = generateReceiptHTML(fps_data);

    // In a real implementation, you would use a PDF generation library
    // For now, we'll return the HTML content that can be converted to PDF on the frontend
    return new Response(
      JSON.stringify({ 
        html: pdfHtml,
        filename: `justificatif-fps-${fps_data.fps_number}-${new Date().toISOString().split('T')[0]}.pdf`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error generating receipt PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateReceiptHTML(fpsData: any): string {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const paymentMethodLabel = {
    'immediate': 'Paiement en une fois',
    'split3': 'Paiement en 3 fois',
    'deferred': 'Paiement différé à 30 jours'
  }[fpsData.payment_method] || 'Paiement unique';

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Justificatif de paiement FPS</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 40px;
          background: white;
          color: #1f2937;
          line-height: 1.6;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #3b82f6;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 24px;
        }
        .company-name {
          font-size: 32px;
          font-weight: bold;
          color: #1f2937;
        }
        .document-title {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin: 40px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .success-badge {
          background: #10b981;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin: 40px 0;
        }
        .info-section {
          background: #f9fafb;
          padding: 24px;
          border-radius: 12px;
          border-left: 4px solid #3b82f6;
        }
        .info-section h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 8px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 12px 0;
          padding: 8px 0;
        }
        .info-row:not(:last-child) {
          border-bottom: 1px solid #e5e7eb;
        }
        .info-label {
          color: #6b7280;
          font-weight: 500;
        }
        .info-value {
          font-weight: 600;
          color: #1f2937;
        }
        .amount-total {
          background: #ecfdf5;
          border: 2px solid #10b981;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .amount-total .label {
          font-size: 16px;
          color: #065f46;
          margin-bottom: 8px;
        }
        .amount-total .value {
          font-size: 36px;
          font-weight: bold;
          color: #059669;
        }
        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .footer .company-info {
          margin-top: 20px;
          font-size: 12px;
          line-height: 1.4;
        }
        .qr-placeholder {
          width: 80px;
          height: 80px;
          background: #f3f4f6;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #6b7280;
        }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">
          <div class="logo-icon">Z</div>
          <div class="company-name">Zenia</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 14px; color: #6b7280;">Date d'émission</div>
          <div style="font-weight: 600;">${currentDate}</div>
        </div>
      </div>

      <div class="document-title">
        Justificatif de Paiement
      </div>

      <div style="text-align: center;">
        <div class="success-badge">✓ PAIEMENT CONFIRMÉ</div>
      </div>

      <div class="info-grid">
        <div class="info-section">
          <h3>Informations FPS</h3>
          <div class="info-row">
            <span class="info-label">Numéro FPS :</span>
            <span class="info-value" style="font-family: monospace;">${fpsData.fps_number}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Clé de contrôle :</span>
            <span class="info-value" style="font-family: monospace;">${fpsData.fps_key}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Véhicule :</span>
            <span class="info-value" style="font-family: monospace;">${fpsData.license_plate}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date de paiement :</span>
            <span class="info-value">${currentDate}</span>
          </div>
        </div>

        <div class="info-section">
          <h3>Détails du paiement</h3>
          <div class="info-row">
            <span class="info-label">Montant FPS :</span>
            <span class="info-value">${fpsData.fps_amount}€</span>
          </div>
          ${parseInt(fpsData.service_fees) > 0 ? `
          <div class="info-row">
            <span class="info-label">Frais de service :</span>
            <span class="info-value">${fpsData.service_fees}€</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">Mode de paiement :</span>
            <span class="info-value">${paymentMethodLabel}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Statut :</span>
            <span class="info-value" style="color: #059669;">Payé</span>
          </div>
        </div>
      </div>

      <div class="amount-total">
        <div class="label">Montant total payé</div>
        <div class="value">${fpsData.total_amount}€</div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin: 40px 0;">
        <div>
          <div style="font-weight: 600; margin-bottom: 8px;">Référence de transaction</div>
          <div style="font-family: monospace; color: #6b7280; font-size: 14px;">${fpsData.session_id || 'N/A'}</div>
        </div>
        <div class="qr-placeholder">
          QR Code
        </div>
      </div>

      <div class="footer">
        <p><strong>Ce document constitue un justificatif officiel de paiement.</strong></p>
        <p>Conservez ce justificatif pour vos dossiers administratifs.</p>
        
        <div class="company-info">
          <strong>Zenia</strong><br>
          Service de paiement des forfaits post-stationnement<br>
          Email: support@zenia.fr | Téléphone: 01 80 88 33 88<br>
          Document généré automatiquement le ${currentDate}
        </div>
      </div>
    </body>
    </html>
  `;
}
