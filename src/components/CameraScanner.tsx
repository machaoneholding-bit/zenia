import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Scan, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

interface CameraScannerProps {
  onScanResult: (data: {
    fpsNumber: string;
    fpsKey: string;
    licensePlate: string;
  }) => void;
  onClose: () => void;
}

export default function CameraScanner({ onScanResult, onClose }: CameraScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      setIsScanning(true);

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setIsScanning(false);
      
      if (err.name === 'NotAllowedError') {
        setError('Accès à la caméra refusé. Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.');
      } else if (err.name === 'NotFoundError') {
        setError('Aucune caméra trouvée sur cet appareil.');
      } else {
        setError('Impossible d\'accéder à la caméra. Vérifiez que votre appareil dispose d\'une caméra et que le navigateur a les permissions nécessaires.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setHasPermission(null);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 for processing
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Simulate OCR processing (in a real app, you'd send this to an OCR service)
    processImage(imageData);
  };

  const processImage = async (imageData: string) => {
    try {
      setError('');
      setScanResult('Analyse de l\'image en cours...');

      // Simulate OCR processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate extracted data (in a real app, this would come from OCR service)
      const mockExtractedData = {
        fpsNumber: '12345678901234 56 7 890 123 456',
        fpsKey: '89',
        licensePlate: 'AB12'
      };

      setScanResult('Informations extraites avec succès !');
      
      // Send result back to parent component
      setTimeout(() => {
        onScanResult(mockExtractedData);
        onClose();
      }, 1000);

    } catch (err) {
      console.error('Error processing image:', err);
      setError('Erreur lors de l\'analyse de l\'image. Veuillez réessayer.');
      setScanResult('');
    }
  };

  const manualEntry = () => {
    // Simulate manual entry with example data
    const exampleData = {
      fpsNumber: '12345678901234 56 7 890 123 456',
      fpsKey: '89',
      licensePlate: 'AB12'
    };
    
    onScanResult(exampleData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Scan className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Scanner l'avis FPS</h3>
                <p className="text-blue-100 text-sm">Pointez votre caméra vers l'avis de paiement</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isScanning && hasPermission === null && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Scanner automatiquement votre avis FPS
                </h4>
                <p className="text-gray-600 mb-6">
                  Utilisez votre caméra pour extraire automatiquement les informations de votre avis de paiement
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h5 className="font-medium text-blue-900 mb-2">Instructions :</h5>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Assurez-vous d'avoir un bon éclairage</li>
                  <li>• Tenez l'avis de paiement bien droit</li>
                  <li>• Centrez le document dans le cadre</li>
                  <li>• Évitez les reflets et les ombres</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={startCamera}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Activer la caméra
                </button>
                
                <button
                  onClick={manualEntry}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Saisie manuelle (exemple)
                </button>
              </div>
            </div>
          )}

          {hasPermission === false && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Accès à la caméra requis
                </h4>
                <p className="text-gray-600 mb-4">
                  {error}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h5 className="font-medium text-yellow-900 mb-2">Comment autoriser l'accès :</h5>
                <ul className="text-sm text-yellow-700 space-y-1 text-left">
                  <li>• Cliquez sur l'icône de caméra dans la barre d'adresse</li>
                  <li>• Sélectionnez "Autoriser" pour ce site</li>
                  <li>• Rechargez la page si nécessaire</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={startCamera}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Réessayer
                </button>
                
                <button
                  onClick={manualEntry}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Continuer sans scanner
                </button>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                
                {/* Overlay guide */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white border-dashed rounded-lg w-80 h-48 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Scan className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Centrez l'avis FPS dans ce cadre</p>
                    </div>
                  </div>
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />

              {scanResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700">{scanResult}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={captureImage}
                  disabled={!!scanResult}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Scan className="w-5 h-5" />
                  Capturer et analyser
                </button>
                
                <button
                  onClick={stopCamera}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Arrêter
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={manualEntry}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Difficultés ? Utiliser un exemple →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}