import html2canvas from 'html2canvas';

export const captureElement = async (elementId: string): Promise<string> => {
  const element = document.getElementById(elementId) as HTMLDivElement;
  element.style.display = 'block';

  const canvas = await html2canvas(element, {
    scale: 2,
    allowTaint: true,
    useCORS: true,
  });

  const img = canvas.toDataURL('image/png');
  element.style.display = 'none';

  return img;
};
