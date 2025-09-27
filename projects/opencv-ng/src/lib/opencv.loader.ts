export async function loadOpenCV() {
  const mod = await import('@techstark/opencv-js');
  return (mod as unknown) as typeof import('@techstark/opencv-js');
}
