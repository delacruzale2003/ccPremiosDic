import React, { useState } from "react";
// Se asume que browser-image-compression ya está instalado: npm install browser-image-compression
import imageCompression from "browser-image-compression"; 
import { useNavigate, useParams } from "react-router-dom";
import { User, Phone, Scan, Camera, Loader2 } from 'lucide-react'; // Importamos iconos necesarios

// === SIMULACIÓN DE UPLOAD Y CONFIGURACIÓN ===
// Estas variables DEBEN ser definidas en tu archivo .env o vite.config.ts
const CAMPAIGN_ID = import.meta.env.VITE_CAMPAIGN || "Campaña Verano 2025";
const API_URL = import.meta.env.VITE_API_URL || "https://sorteopremiosservice.onrender.com";
const UPLOAD_URL = "https://ptm.pe/PremiosApp/upload.php"; // URL de tu script de subida
// ============================================


// Se asume que esta interfaz existe en tu proyecto (o se define aquí para que el código compile)
interface RouteParams extends Record<string, string | undefined> {
    storeId: string;
}

const RegisterPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    // Usamos el tipado correcto para useParams
    const { storeId } = useParams<RouteParams>();
    const navigate = useNavigate();

    // Verificación de ID de Tienda (CRÍTICA)
    if (!storeId) {
        return <div className="p-8 text-center text-red-700 bg-red-100 min-h-screen flex items-center justify-center">
            Error Crítico: ID de tienda no encontrado en la URL. Asegúrate de escanear el QR correctamente.
        </div>;
    }

    // Manejar selección de archivo y compresión
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setCompressedFile(null);
            setPreview(null);
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        setCompressing(true);
        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 1, 
                maxWidthOrHeight: 800,
            });
            setCompressedFile(compressed);
        } catch (err) {
            console.error("Error al comprimir:", err);
            setMessage("❌ Error al comprimir la imagen");
        } finally {
            setCompressing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const form = e.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement)?.value.trim();
        const phoneNumber = (form.elements.namedItem("phone_number") as HTMLInputElement)?.value.trim();
        const dni = (form.elements.namedItem("dni") as HTMLInputElement)?.value.trim(); // <-- EXTRAEMOS DNI

        // Validamos que los campos obligatorios NO estén vacíos.
        if (!name || !phoneNumber || !compressedFile) {
            setMessage("❌ Nombre, Teléfono y Foto son campos obligatorios.");
            setLoading(false);
            return;
        }

        let photoUrl = "";

        // 1. SUBIR LA FOTO COMPRIMIDA (A tu servicio externo PHP)
        try {
            const uploadData = new FormData();
            // Aseguramos que el campo se llame 'photo' si el script PHP lo espera así
            uploadData.append("photo", compressedFile); 

            const uploadRes = await fetch(UPLOAD_URL, {
                method: "POST",
                body: uploadData,
                // No establecemos Content-Type, FormData lo hace automáticamente para Boundary
            });
            
            if (!uploadRes.ok) {
                const errorText = await uploadRes.text();
                throw new Error(`Error en la subida al PHP: ${uploadRes.status} - ${errorText}`);
            }

            const uploadJson = await uploadRes.json();
            // Asumimos que la respuesta JSON del script PHP tiene una propiedad 'url'
            photoUrl = uploadJson.url; 
        } catch (err) {
            console.error("Error al subir la foto:", err);
            setMessage(`❌ Fallo crítico al subir la foto. ${err instanceof Error ? err.message : ''}`);
            setLoading(false);
            return;
        }

        // 2. ENVIAR PAYLOAD FINAL AL BACKEND DE RENDER
        const payload = {
            name,
            phoneNumber,
            dni: dni || undefined, // Envía undefined si está vacío (backend lo convierte a NULL)
            storeId,
            campaign: CAMPAIGN_ID,
            photoUrl, // URL obtenida del upload
        };

        try {
            const res = await fetch(`${API_URL}/api/v1/claim`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const resJson = await res.json();

            if (res.ok) {
                const prizeName = resJson.prize || "Un gran premio!";
                const finalPhotoUrl = resJson.photoUrl || photoUrl;
                
                // Navegar a la página de éxito
                navigate("/exit", {
                    state: {
                        prizeName,
                        photoUrl: finalPhotoUrl,
                    },
                });
            } else {
                setMessage(`❌ ${resJson.message || "Error en el registro del premio"}`);
            }
        } catch (err) {
            setMessage("❌ No se pudo conectar al servidor de Premios (Render)");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Fondo Rojo: bg-red-600
        <div className="min-h-screen flex items-center justify-center bg-red-600 p-4">
            <form
                onSubmit={handleSubmit}
                // Contenedor principal: blanco y redondeado
                className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-100"
            >
                <h1 className="text-3xl font-bold text-center text-gray-900">
                    Registro de Sorteo
                </h1>
                
                {/* ID de Tienda Oculto */}
                <p className="text-sm text-center text-gray-500">Tienda ID: {storeId.substring(0, 8)}...</p>

                {/* Mensaje de Error/Éxito */}
                {message && (
                    <p className="text-center text-sm font-medium mt-2 p-3 bg-red-100 text-red-700 rounded-lg">{message}</p>
                )}


                {/* Campo Nombre */}
                <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">Nombre completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            required
                            // Input transparente con borde blanco
                            className="bg-white/50 border border-white p-3 w-full rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pl-10 shadow-inner"
                        />
                    </div>
                </div>

                {/* Campo DNI */}
                <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">DNI / Cédula (Opcional)</label>
                    <div className="relative">
                        <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="dni"
                            // Input transparente con borde blanco
                            className="bg-white/50 border border-white p-3 w-full rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pl-10 shadow-inner"
                        />
                    </div>
                </div>

                {/* Campo Teléfono */}
                <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">Número de teléfono</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="tel"
                            name="phone_number"
                            required
                            // Input transparente con borde blanco
                            className="bg-white/50 border border-white p-3 w-full rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pl-10 shadow-inner"
                        />
                    </div>
                </div>

                {/* Campo Foto */}
                <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">Comprobante / Foto</label>
                    <input
                        type="file"
                        name="photo_url"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="w-full text-gray-600"
                    />

                    {/* Preview cuadrado con loader */}
                    {preview && (
                        <div className="relative w-32 h-32 border rounded-xl overflow-hidden mx-auto mt-4 shadow-md">
                            <img src={preview} alt="preview" className="object-cover w-full h-full" />
                            {compressing && (
                                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                                    <Loader2 className="animate-spin w-8 h-8 text-white" />
                                </div>
                            )}
                            {compressedFile && !compressing && (
                                <p className="absolute bottom-0 right-0 text-xs bg-green-600 text-white p-1 rounded-tl-lg">
                                    {`Comprimido: ${(compressedFile.size / 1024).toFixed(1)} KB`}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Botón ENVIAR: Rojo Oscuro (bg-red-800) */}
                <button
                    type="submit"
                    disabled={loading || compressing || !compressedFile}
                    className="bg-red-800 text-white p-3 w-full rounded-xl text-lg font-semibold hover:bg-red-900 transition-colors duration-200 disabled:opacity-50 shadow-xl mt-8"
                >
                    {loading ? "ENVIANDO..." : "ENVIAR Y RECLAMAR PREMIO"}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;