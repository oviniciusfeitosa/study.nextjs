const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';

export async function fetchStrapi(endpoint: string) {
  // Em 2026, Next.js usa cache nativo do fetch com revalidação
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    next: { revalidate: 3600 } // Revalida a cada 1 hora
  });
  if (!res.ok) throw new Error(`Falha ao buscar: ${endpoint}`);
  return res.json();
}