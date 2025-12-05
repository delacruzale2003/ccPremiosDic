import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; 

interface ExitState {
    prizeName: string;
    photoUrl: string; // Aunque ya no se usa, lo mantenemos en la interfaz del state
}

// Función para normalizar el nombre del premio a una URL de archivo: "MANDIL" -> "assets/mandil.png"
const normalizePrizeName = (name: string | null): string | null => {
    if (!name || name === "¡Gracias por participar! Contacta a la tienda para más detalles.") {
        return null;
    }
    // 1. Convertir a minúsculas
    // 2. Reemplazar espacios con guiones bajos
    const safeName = name.toLowerCase().replace(/\s+/g, '_');
    // Asumimos que todas las imágenes están en /assets/
    return `/${safeName}.png`;
};


const ExitPage = () => {
    
    const location = useLocation();
    
    const state = location.state as ExitState | null;

    const [prizeName, setPrizeName] = useState<string | null>(null);
    // 💡 CAMBIO: photoUrl se convierte en prizeImageUrl
    const [prizeImageUrl, setPrizeImageUrl] = useState<string | null>(null);

    // 💡 useEffect para establecer los datos y manejar la persistencia
    useEffect(() => {
        let finalPrizeName = null;
        let storedDataAvailable = false;

        // 1. Intentar leer del estado de navegación (primera carga)
        if (state && state.prizeName) {
            finalPrizeName = state.prizeName;
            storedDataAvailable = true;
            // 💡 Acción: Guardar en localStorage para recargas F5
            localStorage.setItem("prizeName", state.prizeName);
            // La photoUrl original ya no es relevante aquí
            if (state.photoUrl) {
                localStorage.setItem("photoUrl", state.photoUrl); 
            } else {
                 localStorage.removeItem("photoUrl");
            }
        } else {
            // 2. Si el estado no existe (ej: recarga F5), leer de localStorage
            const storedPrize = localStorage.getItem("prizeName");
            if (storedPrize) {
                finalPrizeName = storedPrize;
                storedDataAvailable = true;
            }
        }
        
        // 3. Establecer el estado del componente
        if (finalPrizeName && storedDataAvailable) {
            setPrizeName(finalPrizeName);
            // 💡 CRÍTICO: Usamos el nombre del premio para obtener la URL de la imagen
            setPrizeImageUrl(normalizePrizeName(finalPrizeName));
        } else {
            // Si no hay datos en ningún lado, mostramos mensaje genérico
            setPrizeName("¡Gracias por participar! Contacta a la tienda para más detalles.");
            setPrizeImageUrl(null);
        }
    }, [state]); // Dependencia del state para reaccionar a la navegación

    // Función para volver al inicio
    

    return (
        // 💡 CORRECCIÓN 2: Deshabilita pull-to-refresh en el móvil.
        // La clase `overscroll-y-none` previene el comportamiento de actualización del navegador.
        <div className="min-h-screen flex items-center text-center justify-center bg-[#e30613] p-4 overscroll-y-none">
            
            <div className="bg-transparent  rounded-2xl p-8 w-full max-w-md space-y-1  text-center mx-auto">
                
                {/* 💡 CORRECCIÓN 1: Centrar logo de arriba */}
                <img
                    src="/logoccnavidad.png"
                    alt="Logo CC Navidad"
                    className="w-40 h-auto mb-4 z-10 mx-auto" 
                />
                <h1 className="text-5xl text-white font-semibold font-betterwith tracking-wide leading-none">
  <span className="block">FELICIDADES</span>
  <span className="block text-4xl">HAS GANADO</span>
</h1>

                {/* Bloque del Premio Destacado */}
                <div className="p-2 bg-transparent space-y-3">
                    
                    
                    
                    
                    {/* 💡 IMAGEN DEL PREMIO (En lugar de la foto del usuario) */}
                    {prizeImageUrl && (
                        <img 
                            src={prizeImageUrl} 
                            alt={`Imagen del premio ${prizeName}`} 
                            className="mt-1 mx-auto rounded-lg max-h-56 object-contain w-full" 
                        />
                    )}
                    {/* Si no hay imagen, mostramos un fallback visual o nada */}
                    {!prizeImageUrl && <div className='mt-6 h-56 flex items-center justify-center text-red-700 font-bold'>Cargando...</div>}
                    <p className="text-4xl font-betterwith text-white mt-3 ">
                        {/* Mostrar el estado actualizado */}
                        {prizeName} 
                    </p>
                    
                    {/* 💡 CORRECCIÓN 1: Centrar logo de abajo */}
                    <img
                        src="/cclogo.png"
                        alt="Logo CC Navidad"
                        className="w-40 h-auto z-10 mx-auto mt-4" 
                    />
                </div>
                
                
                
                
            </div>
        </div>
    );
};


export default ExitPage;