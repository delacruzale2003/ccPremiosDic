import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { useNavigate, useParams } from "react-router-dom";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();

  if (!storeId) {
    return <div>Error: ID de tienda no encontrado en la URL.</div>;
  }

  // Manejar selección de archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview inmediato
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Comprimir con loader
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

    if (!name || !phoneNumber) {
      setMessage("❌ Por favor, complete todos los campos requeridos.");
      setLoading(false);
      return;
    }

    let photoUrl = "";

    // Subir la foto comprimida
    if (compressedFile) {
      const uploadData = new FormData();
      uploadData.append("photo", compressedFile);

      try {
        const uploadRes = await fetch("https://ptm.pe/PremiosApp/upload.php", {
          method: "POST",
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        photoUrl = uploadJson.url;
      } catch (err) {
        setMessage("❌ Error al subir la foto");
        setLoading(false);
        return;
      }
    }

    const payload = {
      name,
      phoneNumber,
      storeId,
      campaign: import.meta.env.VITE_CAMPAIGN || "DEFAULT_CAMPAIGN_ID",
      photoUrl,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://sorteopremiosservice.onrender.com";
      const res = await fetch(`${apiUrl}/api/v1/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();

      if (res.ok) {
  const prizeName = resJson.prize || "Un gran premio!";
  const finalPhotoUrl = resJson.photoUrl || photoUrl;

  // 🥇 PASO 1: Guardar en localStorage para persistencia
  localStorage.setItem("prizeName", prizeName);
  localStorage.setItem("photoUrl", finalPhotoUrl);

  // 🥈 PASO 2: Navegar con el state (para la primera carga limpia)
  navigate("/exit", {
    state: {
      prizeName,
      photoUrl: finalPhotoUrl,
    },
  });
} else {
        setMessage(`❌ ${resJson.message || "Error en el registro"}`);
      }
    } catch (err) {
      setMessage("❌ No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-200"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-900">
          Registro de Premio
        </h1>

        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium">Nombre completo</label>
          <input
            type="text"
            name="name"
            required
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium">Número de teléfono</label>
          <input
            type="tel"
            name="phone_number"
            required
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium">Foto</label>
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
            <div className="relative w-32 h-32 border rounded-lg overflow-hidden mx-auto mt-2">
              <img src={preview} alt="preview" className="object-cover w-full h-full" />
              {compressing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="loader border-4 border-t-4 border-white rounded-full w-8 h-8 animate-spin"></div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-3 w-full rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Registrar"}
        </button>

        {message && (
          <p className="text-center text-sm font-medium mt-2 text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;
