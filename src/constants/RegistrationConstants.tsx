// src/constants/RegistrationConstants.ts

// Tipo para los parámetros de la ruta
export interface RouteParams extends Record<string, string | undefined> {
    storeId: string;
}

// Variables de Configuración (simulando que vienen de .env o Vite)
export const CAMPAIGN_ID = import.meta.env.VITE_CAMPAIGN || "Campaña Verano 2025";
export const API_URL = import.meta.env.VITE_API_URL || "https://sorteopremiosservice.onrender.com";
export const UPLOAD_URL = "https://ptm.pe/PremiosApp/upload.php";