'use client';
import styles from './Plantilla.module.css';
import { useEffect, useState } from 'react';
import { IoCall, IoDocument, IoLogoWhatsapp } from 'react-icons/io5';
import { FaArrowDown, FaArrowUp, FaCamera, FaDollarSign, FaImages, FaLocationDot, FaTrash } from 'react-icons/fa6';
import { SiFlatpak } from 'react-icons/si';
import { BiSolidFlag } from 'react-icons/bi';
import html2canvas from 'html2canvas';
import { IoMdDocument } from 'react-icons/io';
import Swal from 'sweetalert2';

interface PubInfo {
  tipoPublicacion: string;
  tipoInmueble: string;
  ubicacion: {
    municipio: string;
    direccion: string;
    distancia?: string;
  };
  area: {
    valor: string;
  };
  precio: string;
  imagenes: File[];
  detalles?: string;
}

const defaultPub: PubInfo = {
  imagenes: [] as File[],
  ubicacion: {
    municipio: '',
    direccion: '',
  },
  area: {
    valor: '',
  },
} as PubInfo;

const tiposPublicaciones = ['Arrienda', 'Busca administrador para', 'Permuta', 'Vende'];
const tiposInmuebles = [
  'Alcoba', 'Apartaestudio', 'Apartamento', 'Bodega', 'Casa', 'Casa lote',
  'Casa quinta', 'Finca', 'Finca campestre', 'Finca recreacional - Glamping',
  'Finca turística', 'Finca vacacional', 'Local', 'Lote',
];

const formatPrice = (price: string) => {
  return price.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

export const Plantilla = () => {
  const [pub, setPub] = useState<PubInfo>(defaultPub);
  const [ubicacion, setUbicacion] = useState<string>('');
  const [imgPub, setImgPub] = useState<string>('');

  useEffect(() => {
    handleCapture();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pub) {
      timer = setTimeout(() => {
        handleCapture();
      }, 1000); // Captura la pantalla un segundo después de que cambie "pub"
    }

    return () => clearTimeout(timer); // Limpia el temporizador en caso de que "pub" cambie antes de que se active el temporizador
  }, [pub]);

  useEffect(() => {
    setUbicacion(`${pub.ubicacion?.municipio || '(PREG 3)'} - ${pub.ubicacion?.direccion || '(PREG 4)'}`);
  }, [pub.ubicacion]);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Verifica si pub.imagenes es un array
      if (!Array.isArray(pub.imagenes)) {
        // Si no es un array, inicialízalo como un array vacío
        setPub({ ...pub, imagenes: files });
      } else {
        // Si es un array, agrega los nuevos archivos al array existente
        setPub({ ...pub, imagenes: [...pub.imagenes, ...files] });
      }
    }
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const images = [...pub.imagenes];
    const image = images[index];
    images.splice(index, 1);
    images.splice(direction === 'up' ? index - 1 : index + 1, 0, image);
    setPub({ ...pub, imagenes: images });
  };

  const handleDeleteImage = (index: number) => {
    const images = [...pub.imagenes];
    images.splice(index, 1);
    setPub({ ...pub, imagenes: images });
  };

  const handleCapture = () => {
    const plantilla = document.getElementById('plantilla-contenido') as HTMLDivElement;
    plantilla.style.display = 'block';
    // Las imagenes que están dentro de la plantilla se ven deformes, por lo que se recortan a un tamaño más pequeño
    html2canvas(plantilla, {
      scale: 2,
      allowTaint: true,
      useCORS: true,
    }).then((canvas) => {
      const img = canvas.toDataURL('image/png');
      setImgPub(img);
    });

    plantilla.style.display = 'none';
  };

  const handleDownload = () => {
    if (!validateFields()) return;

    const a = document.createElement('a');
    a.href = imgPub;
    a.download = `Publicación - ${pub.tipoPublicacion?.toUpperCase() || '???'} ${pub.tipoInmueble?.toUpperCase() || '???'} - ${pub?.ubicacion?.direccion?.toLocaleLowerCase() || '???'} - ${new Date().toLocaleDateString()}.png`;
    a.click();
  };

  const validateFields = () => {
    const newErrors = [];
    if (!pub.tipoPublicacion) newErrors.push('Selecciona una opción en el campo "¿Qué desea hacer?"');
    if (!pub.tipoInmueble) newErrors.push('Selecciona una opción en el campo "¿Qué tipo de inmueble es?"');
    if (!pub.ubicacion.municipio) newErrors.push('Ingresa el municipio en el campo "¿En qué municipio se encuentra?"');
    if (!pub.ubicacion.direccion) newErrors.push('Ingresa la dirección en el campo "¿Cuál es la dirección?"');
    if (!pub.area.valor || pub.area.valor === '0') newErrors.push('Ingresa el área en el campo "¿Cuál es el área del inmueble?"');
    if (!pub.precio || pub.precio === '0') newErrors.push('Ingresa el precio en el campo "¿Cuál es el precio del inmueble?"');
    if (!pub.detalles || pub.detalles.length < 10) newErrors.push('Ingresa una descripción adicional de al menos 10 caracteres');
    if (!pub.imagenes.length) newErrors.push('Debes seleccionar al menos una imagen del inmueble');

    if (newErrors.length) {
      // Mostrar solo el primer error
      Swal.fire({
        icon: 'warning',
        title: newErrors[0],
      });
    }

    return newErrors.length === 0;
  };

  const handleShareToFacebook = async () => {
    // Validar compatibilidad con la API de Web Share y clipboard
    if (!navigator.share) {
      Swal.fire({ icon: 'error', title: 'El navegador no soporta compartir contenido por una aplicación externa' });
      return;
    }

    if (!navigator.clipboard) {
      Swal.fire({ icon: 'error', title: 'El navegador no soporta copiar al portapapeles' });
      return;
    }

    if (!validateFields()) return;

    // share via browser share api
    const imageFile = await getConvertedImageToFile(imgPub);

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

  const getConvertedImageToFile = async (img: string) => {
    const response = await fetch(img);
    const blob = await response.blob();
    return new File([blob], `Publicación - ${pub.tipoPublicacion?.toUpperCase() || '???'} ${pub.tipoInmueble?.toUpperCase() || '???'} - ${pub?.ubicacion?.direccion?.toLocaleLowerCase() || '???'} - ${new Date().toLocaleDateString()}.png`, { type: 'image/png' });
  };

  return (
    <div className={styles['plantilla-container']}>
      <div className={styles['plantilla-contenido']} id='plantilla-contenido'>
        <div className={styles['plantilla-header']}>
          {/*eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={'/img/logo.png'}
            alt="Logotipo de la inmobiliaria"
            width={181}
            height={131}
          />
          <div>
            <h2>Asesorias Juridicas E Inmobiliarias S&J</h2>
            <div className={styles['contacto']}>
              <div>
                <IoCall width={30} height={30} />
                <p>313 337 76 23</p>
              </div>
              <div>
                <IoLogoWhatsapp width={30} height={30} />
                <p>310 310 92 87</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['plantilla-body']}>
          <div>
            <img
              className={styles['watermark']}
              src='/img/SJ Water Mark.png'
              alt='Logotipo de la inmobiliaria'
              width={300} height={300}
            />
            <div className={styles['pub-title']}>
              <h3>Se {pub.tipoPublicacion?.toUpperCase() || '(PREG 1)'} {pub.tipoInmueble?.toUpperCase() || '(PREG 2)'}</h3>
            </div>
            <div className={styles['pub-info']}>
              <div className={styles['pub-item']}>
                <FaLocationDot />
                <p><span>Ubicación:</span> {ubicacion ?? '(PREG 3, 4)'}</p>
              </div>
              {pub?.ubicacion?.distancia && (
                <div className={styles['pub-item']}>
                  <BiSolidFlag />
                  <p><span>Distancia:</span> {pub.ubicacion?.distancia || '(PREG 5)'}</p>
                </div>
              )}
              <div className={styles['pub-item']}>
                <SiFlatpak />
                <p><span>Área:</span> {pub.area?.valor || '(PREG 6)'}</p>
              </div>
              <div className={styles['pub-item']}>
                <FaDollarSign />
                <p><span>Precio:</span> ${pub.precio ? formatPrice(pub.precio) : '(PREG 7)'}</p>
              </div>
              <div className={`${styles['pub-item']} ${styles['pub-descripcion']}`}>
                <div>
                  <IoMdDocument />
                  <p><span>Descripción del inmueble:</span></p>
                </div>
                <pre>{pub.detalles || '(PREG 8)'}</pre>
              </div>
            </div>
          </div>
          <div className={styles['pub-imagenes']}>
            {pub.imagenes?.length ? (
              pub.imagenes.map((img, i) => (
                //eslint-disable-next-line @next/next/no-img-element
                <div
                  key={i}
                >
                  <div className={styles['img-watermark']}>
                    <img
                      className={styles['watermark']}
                      src='/img/SJ Water Mark.png'
                      alt='Logotipo de la inmobiliaria'
                      width={50} height={50}
                    />
                  </div>
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Imágen ${i + 1}`}
                    width={100}
                    height={100}
                    style={{ objectFit: 'scale-down' }}
                  />
                </div>
              ))
            ) : (
              <p>(PREG 9) Seleccione las imágenes del inmueble</p>
            )}
          </div>
        </div>
        <div className={styles['plantilla-footer']}>
          <p>Ventas, licencias  urbanismo y construcción, levantamiento topográfico, cancelación de hipoteca, patrimonio, embargos. Englobes, desenglobes. Trámites Notariales, judiciales y otros.</p>
        </div>
      </div>
      <div className={styles['plantilla-form']}>
        <div className={styles['separador']}>
          <IoDocument />
          <h4>Información del inmueble</h4>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor='tipoPublicacion'>1. ¿Qué desea hacer? (Vender o arrendar)</label>
          <select
            name='tipoPublicacion'
            id='tipoPublicacion'
            onChange={(e) => setPub({ ...pub, tipoPublicacion: e.target.value })}
            defaultValue={''}
          >
            <option value='' disabled>Ejemplo. Vende</option>
            {tiposPublicaciones.map((tipo, i) => (
              <option key={i} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor='tipoInmueble'>2. ¿Qué tipo de inmueble es?</label>
          <select
            name='tipoInmueble'
            id='tipoInmueble'
            onChange={(e) => setPub({ ...pub, tipoInmueble: e.target.value })}
            defaultValue={''}
          >
            <option>Ejemplo. Casa</option>
            {tiposInmuebles.map((tipo, i) => (
              <option key={i} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        <div className={styles['separador']}>
          <FaLocationDot />
          <h4>¿Cuál es la ubicación del inmueble?</h4>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor='municipio'>3. ¿En qué municipio se encuentra?</label>
          <input
            type='text'
            name='municipio'
            id='municipio'
            placeholder='Ejemplo. Gachetá'
            onChange={(e) => setPub({ ...pub, ubicacion: { ...pub.ubicacion, municipio: e.target.value } })}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor='direccion'>4. ¿Cuál es la dirección?</label>
          <input
            type='text'
            name='direccion'
            id='direccion'
            placeholder='Ejemplo. Calle 1 # 2-3 o Vereda Bombita km 3'
            onChange={(e) => setPub({ ...pub, ubicacion: { ...pub.ubicacion, direccion: e.target.value } })}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor='distancia'>5. ¿Qué distancia hay desde el punto conocido más cercano? (Opcional)</label>
          <input
            type='text'
            name='distancia'
            id='distancia'
            placeholder='Ejemplo. A 5 km de la plaza principal'
            onChange={(e) => setPub({ ...pub, ubicacion: { ...pub.ubicacion, distancia: e.target.value } })}
          />
        </div>
        <div className={styles['separador']}>
          <SiFlatpak />
          <h4>¿Cuál es el área del inmueble?</h4>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor='valorArea'>6. ¿Cuál es el área total?</label>
          <input
            type='text'
            name='valorArea'
            id='valorArea'
            placeholder='Ejemplo. 100'
            onChange={(e) => setPub({ ...pub, area: { ...pub.area, valor: e.target.value } })}
          />
        </div>
        <div className={styles['separador']}>
          <FaDollarSign />
          <h4>¿Cuál es el precio del inmueble?</h4>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor='precio'>7. ¿Cuánto cuesta en pesos colombianos?</label>
          <input
            type='text'
            name='precio'
            id='precio'
            placeholder='Ejemplo. 1500000'
            onChange={(e) => setPub({ ...pub, precio: e.target.value })}
          />
        </div>
        <div className={styles['separador']}>
          <IoDocument />
          <h4>Descripción adicional</h4>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor='detalles'>8. ¿Hay algo más que debamos saber?</label>
          <textarea
            name='detalles'
            id='detalles'
            placeholder='Ejemplo. Casa de dos pisos con 3 habitaciones y 2 baños'
            onChange={(e) => setPub({ ...pub, detalles: e.target.value })}
            inlist={3}
          />
        </div>
        <div className={styles['separador']}>
          <FaImages />
          <h4>Imágenes del inmueble</h4>
        </div>
        <div className={`${styles['form-group']} ${styles['form-file']}`}>
          <label htmlFor='imagenes'>
            <FaImages />
            <span>9. Toca aquí para seleccionar las imágenes</span>
          </label>
          <input
            type='file'
            name='imagenes'
            id='imagenes'
            multiple
            accept='image/*'
            onChange={handleChangeFile}
          />
        </div>
        <div className={styles['imagenes-preview']}>
          {pub.imagenes?.length ? (
            pub.imagenes.map((img, i) => (
              <div key={i}>
                <span>{i + 1}</span>
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Imágen ${i + 1}`}
                  width={100}
                  height={100}
                />
                <span>{img.name}</span>
                <div>
                  {i !== 0 ? <button onClick={() => handleMoveImage(i, 'up')}><FaArrowUp /></button> : null}
                  {i !== pub.imagenes.length - 1 ? <button onClick={() => handleMoveImage(i, 'down')}><FaArrowDown /></button> : null}
                  <button onClick={() => handleDeleteImage(i)}><FaTrash /></button>
                </div>
              </div>
            ))
          ) : (
            <p>No se han seleccionado imágenes</p>
          )}
        </div>
        <div className={styles['separador']}>
          <FaCamera />
          <h4>Previsualización de la publicación</h4>
        </div>
        {imgPub ? (
          <div className={styles['preview-container']}>
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src={imgPub}
              alt='Previsualización de la publicación'
              width={1000}
              height={3000}
            />
          </div>
        ) : (
          <button onClick={handleCapture}>Generar previsualización</button>
        )}
        <div className={styles['botones']}>
          <button onClick={handleDownload}>Descargar publicación</button>
          <button onClick={handleShareToFacebook}>Compartir en Facebook</button>
          <button onClick={() => setPub({} as PubInfo)}>Limpiar formulario</button>
        </div>
      </div>
    </div>
  )
}
