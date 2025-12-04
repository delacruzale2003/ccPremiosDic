import React from "react";
import { useRegistration } from "../hooks/useRegistration"; // <-- Corregido: eliminado .js
import { User, Phone, Scan, Loader2 } from 'lucide-react';
import BackgroundCC from "../components/BackgroundCC"; // <-- Corregido: eliminado .js

const RegisterPage: React.FC = () => {
    // Usamos el hook personalizado para acceder a toda la lógica y estados
    const {
        loading,
        compressing,
        preview,
        compressedFile,
        message,
        name,
        dni,
        phoneNumber,
        storeId,
        setName,
        setDni,
        setPhoneNumber,
        handleFileChange,
        handleSubmit,
    } = useRegistration();

    // Verificación de ID de Tienda (CRÍTICA)
    if (!storeId) {
        return <div className="p-8 text-center text-red-700 bg-red-100 min-h-screen flex items-center justify-center">
            Error: ID de tienda no encontrado en la URL. Asegúrate de escanear el QR correctamente.
        </div>;
    }

    // El fondo rojo y animado ahora lo maneja BackgroundCC
    return (
        // Contenedor principal. Se elimina el color de fondo y queda como contenedor del contenido.
        // Se añade 'relative' para asegurar el contexto de apilamiento sobre el fondo fijo.
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            
            {/* Componente de Fondo Animado: Establece el color #e30613 y las decoraciones */}
            <BackgroundCC /> 
            
            {/* Logo de la Campaña - AGREGADO AQUÍ */}
            <img
                src="/logoccnavidad.png"
                alt="Logo CC Navidad"
                className="w-40 h-auto mb-4 z-10" // w-40 es suficiente en móvil
            />
            
            {/* Contenedor del Formulario (Transparente) */}
            <form
                id="registrationForm" // <-- ID agregado para vincular el botón
                onSubmit={handleSubmit}
                // z-10 asegura que el formulario esté sobre el fondo animado
                className="bg-transparent border border-white border-3 rounded-4xl p-6 pt-4 w-full max-w-md space-y-1 shadow-2xl mb-6 z-10" 
            >
                <h1 className="text-4xl text-start text-white font-betterwith tracking-wide">
                    1.REGISTRATE PARA PARTICIPAR
                </h1>
                <h2 className="text-start font-mont-extrabold text-white text-lg mb-4">Llena tus datos y participa por fabulosos premios</h2>
                
                {/* ID de Tienda Oculto */}
                <p className="text-sm text-center font-mont-extrabold text-white/80">Tienda ID: {storeId.substring(0, 8)}...</p>

                {/* Mensaje de Error/Éxito */}
                {message && (
                    <p className="text-center text-sm font-medium mt-2 p-3 bg-red-100 text-red-700 rounded-lg">{message}</p>
                )}


                {/* Campo Nombre */}
                <div className="">
                    <label className="block text-white text-md font-medium font-mont-extrabold mt-2">Nombre completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={45}
                            // Input transparente con borde blanco
                            className="bg-transparent border-3 border-white p-3 w-full rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pl-10 shadow-inner"
                        />
                    </div>
                </div>

                {/* Campo DNI */}
                <div className="">
                    <label className="block text-white text-md font-medium font-mont-extrabold mt-2">DNI / Cédula (Opcional)</label>
                    <div className="relative">
                        <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="dni"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            maxLength={11}
                            // Input transparente con borde blanco
                            className="bg-transparent border-3 border-white p-3 w-full rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pl-10 shadow-inner"
                        />
                    </div>
                </div>

                {/* Campo Teléfono */}
                <div className="">
                    <label className="block text-white text-md font-medium font-mont-extrabold mt-2">Número de teléfono</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="tel"
                            name="phone_number"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            maxLength={9}
                            // Input transparente con borde blanco
                            className="bg-transparent border-3 border-white p-3 w-full rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pl-10 shadow-inner"
                        />
                    </div>
                </div>

                {/* Campo Foto */}
                <div className="space-y-1">
                    <label className="block text-white text-md font-medium font-mont-extrabold mt-2">Comprobante / Foto</label>
                    <input
                        type="file"
                        name="photo_url"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="w-full text-white/90 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-700 file:text-white hover:file:bg-red-800"
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
                                <p className="absolute bottom-0 right-0 text-xs bg-gray-800 text-white p-1 rounded-tl-lg">
                                    {`${(compressedFile.size / 1024).toFixed(1)} KB`}
                                </p>
                            )}
                        </div>
                    )}
                </div>

            </form>

            {/* Botón ENVIAR: ROJO, FUERA DEL FORMULARIO PERO VINCULADO */}
            <button
                type="submit"
                form="registrationForm" // <-- Vincula el botón al formulario por ID
                disabled={loading || compressing || !compressedFile || name.trim() === '' || phoneNumber.trim() === ''}
                // CORREGIDO: Usamos w-full para asegurar que llene el ancho disponible en móvil.
                className="bg-red-800 font-betterwith rounded-full text-4xl text-white p-3 w-50 max-w-md font-semibold hover:bg-red-900 transition-colors duration-200 disabled:opacity-50 shadow-xl z-10" 
            >
                {loading ? "ENVIANDO..." : "ENVIAR"}
            </button>
        </div>
    );
};

export default RegisterPage;