import React, { useState } from "react"; // 💡 Importamos useState y useEffect
import { useRegistration } from "../hooks/useRegistration"; 
import { User, Phone, Scan, Loader2, X } from 'lucide-react'; // 💡 Importamos X para el botón de cerrar
import BackgroundCC from "../components/BackgroundCC"; 

const RegisterPage: React.FC = () => {
    // 1. 💡 NUEVO ESTADO: Controla si el modal de términos está visible
    const [showTermsModal, setShowTermsModal] = useState(true);

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

    // 💡 NUEVA FUNCIÓN: Para cerrar el modal
    const handleCloseModal = () => {
        setShowTermsModal(false);
    };

    // Opcional: Si el usuario ya completó el registro con éxito, quizás no mostrar el modal de nuevo, 
    // pero por ahora lo dejamos simple: se muestra al cargar.

    // Verificación de ID de Tienda (CRÍTICA)
    if (!storeId) {
        return <div className="p-8 text-center text-red-700 bg-red-100 min-h-screen flex items-center justify-center">
            Error: ID de tienda no encontrado en la URL. Asegúrate de escanear el QR correctamente.
        </div>;
    }

    // 💡 Lógica de validación centralizada
    const isFormValid = name.trim() !== '' && phoneNumber.trim() !== '' && dni.trim() !== '' && compressedFile;
    // El formulario está deshabilitado si está cargando, comprimiendo O si el modal de términos está abierto
    const isDisabled = loading || compressing || !isFormValid || showTermsModal;

    return (
        // Contenedor principal.
        <div className="min-h-screen flex flex-col items-center justify-start p-4 pb-28 relative">
            
            {/* Componente de Fondo Animado */}
            <BackgroundCC /> 
            
            {/* Logo de la Campaña */}
            <img
                src="/logoccnavidad.png"
                alt="Logo CC Navidad"
                className="w-40 h-auto mb-4 z-10" 
            />
            
            {/* Contenedor del Formulario (Transparente) */}
            <form
                id="registrationForm"
                onSubmit={handleSubmit}
                // z-10 asegura que el formulario esté sobre el fondo animado
                className="bg-transparent border border-white border-3 rounded-4xl p-6 pt-4 w-full max-w-md space-y-1 shadow-2xl mb-6 z-10" 
            >
                <h1 className="text-4xl text-start text-white font-betterwith tracking-wide">
                    1.REGISTRATE PARA PARTICIPAR
                </h1>
                <h2 className="text-start font-mont-extrabold text-white text-lg mb-4">Llena tus datos y participa por fabulosos premios</h2>
                
                {/* Mensaje de Error/Éxito */}
                {message && (
                    <p className="text-center text-sm font-medium mt-2 p-3 bg-red-100 text-red-700 rounded-lg">{message}</p>
                )}

                {/* Campos del formulario... (sin cambios) */}
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
                    <label className="block text-white text-md font-medium font-mont-extrabold mt-2">DNI</label>
                    <div className="relative">
                        <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="dni"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            maxLength={11}
                            required 
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

            {/* BARRA FIJA INFERIOR PARA EL BOTÓN EN MÓVIL */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent z-20">
                <button
                    type="submit"
                    form="registrationForm" 
                    disabled={isDisabled} 
                    // 💡 Nota: Mantiene el estilo original. El botón no será accesible si el modal está abierto (debido a la variable `isDisabled`).
                    className="bg-red-800 font-betterwith rounded-full text-4xl sm:text-2xl text-white p-3 w-full max-w-md font-semibold transition-colors duration-200 shadow-xl mx-auto block
                                disabled:bg-red-800 disabled:text-white/60 disabled:opacity-0 hover:bg-gray-200 hover:text-gray-900" 
                >
                    {loading ? "ENVIANDO..." : "ENVIAR"}
                </button>
            </div>


           
            {/* 2. 💡 COMPONENTE MODAL DE TÉRMINOS Y CONDICIONES */}
            {showTermsModal && (
                // Overlay: Usa un color rojo oscuro semi-transparente y añade blur al fondo
                <div className="fixed inset-0 bg-red-500/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    
                    {/* Contenido del Modal */}
                    <div className="bg-white rounded-4xl p-6 pt-4 w-full max-w-sm max-h-[80vh] flex flex-col relative shadow-2xl">
                        
                        {/* Botón de Cerrar (X) en la esquina */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
                            aria-label="Cerrar términos y condiciones"
                        >
                            <X size={24} />
                        </button>
                        
                        {/* Título */}
                        <h2 className="text-2xl text-red-800 font-betterwith tracking-wide text-center mb-2">
                            Términos y Condiciones
                        </h2>

                        {/* Contenido Desplazable */}
                        <div className="flex-grow overflow-y-auto text-gray-700 text-sm space-y-3 pb-4">
    
    <p className="font-mont-extrabold text-gray-900">
        Promoción Válida del 04 de diciembre al 31 de enero del 2026.
    </p>

    <p className="font-semibold text-gray-900">
        Mecánica: Campaña Coca-Cola Navidad
    </p>

    <p>
        Participan personas naturales mayores de 18 años, con residencia legal y domicilio en el territorio nacional del Perú, que realicen la compra de productos **Coca-Cola** en las tiendas seleccionadas y escaneen el código QR de la promoción.
    </p>
    
    <p className="font-semibold">Requisitos de participación:</p>
    <ul className="list-disc list-inside space-y-1 ml-4">
        <li>Ser mayor de 18 años.</li>
        <li>Presentar un comprobante de compra válido (boleta o factura).</li>
        <li>La compra debe ser de productos **Coca-Cola**.</li>
        <li>Los datos de registro deben ser veraces y exactos.</li>
        <li>La participación está limitada a una vez por comprobante.</li>
    </ul>

    <p>
        Al hacer click en "Continuar", aceptas haber leído, entendido y estar de acuerdo con las bases y condiciones de la promoción "Campaña Coca-Cola".
    </p>
    
    
</div>

                        {/* Botón de Continuar */}
                        <button
                            onClick={handleCloseModal}
                            className="mt-4 bg-red-800 rounded-full text-xl text-white p-3 font-semibold hover:bg-red-700 transition-colors shadow-lg"
                        >
                            CONTINUAR
                        </button>

                    </div>
                </div>
            )}


        </div>
    );
};

export default RegisterPage;