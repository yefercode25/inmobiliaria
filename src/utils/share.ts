export const shareToFacebook = async (pub, imgPub, ubicacion, formatPrice) => {
  // Validar compatibilidad con la API de Web Share y clipboard
  if (!navigator.share) {
    Swal.fire({ icon: 'error', title: 'El navegador no soporta compartir contenido por una aplicación externa' });
    return;
  }

  if (!navigator.clipboard) {
    Swal.fire({ icon: 'error', title: 'El navegador no soporta copiar al portapapeles' });
    return;
  }

  // share via browser share api
  const imageFile = await getConvertedImageToFile(imgPub, pub, ubicacion);

  let textPub = `SE ${pub.tipoPublicacion?.toUpperCase() || '???'} ${pub.tipoInmueble?.toUpperCase() || '???'} \n\n`;
  textPub += `- Está ubicado en ${ubicacion} y tiene un área de ${pub.area?.valor}. \n`;
  textPub += `- Precio: $${formatPrice(pub.precio)}. \n\n`;
  textPub += `${pub.detalles || ''} \n\n`;
  textPub += `#AsesoriasJuridicasEInmobiliariasS&J #Inmobiliaria #Venta #Arriendo #Inmueble #Propiedad #BienesRaices`

  // copiar al portapapeles el texto
  navigator.clipboard.writeText(textPub.trim())
    .then(() => console.log('Texto copiado al portapapeles'))
    .catch((error) => console.error('Error al copiar el texto al portapapeles:', error));

  const shareData = {
    title: `SE ${pub.tipoPublicacion?.toUpperCase() || '???'} ${pub.tipoInmueble?.toUpperCase() || '???'}`,
    text: textPub,
    files: [imageFile],
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => Swal.fire({ icon: 'success', title: 'Publicación compartida con éxito' }))
      .catch((error) => console.error('Error al compartir:', error));
  } else {
    Swal.fire({ icon: 'error', title: 'El navegador no soporta la API de Web Share' });
  }
};

const getConvertedImageToFile = async (img, pub, ubicacion) => {
  const response = await fetch(img);
  const blob = await response.blob();
  return new File([blob], `Publicación - ${pub.tipoPublicacion?.toUpperCase() || '???'} ${pub.tipoInmueble?.toUpperCase() || '???'} - ${ubicacion?.toLocaleLowerCase() || '???'} - ${new Date().toLocaleDateString()}.png`, { type: 'image/png' });
};
