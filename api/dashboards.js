export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  // Verificar que el token sea válido con Supabase
  const verify = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'apikey': SUPABASE_ANON_KEY,
    }
  });

  if (!verify.ok) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  // Solo si el token es válido, devolvemos las URLs
  return res.status(200).json({
    dashboards: [
      {
        title: "Monitor CNV",
        color: "#3b6ff0",
        url: process.env.DASHBOARD_URL_CNV
      },
      {
        title: "Monitor Campaña ATG",
        color: "#7c5cfc",
        url: process.env.DASHBOARD_URL_ATG
      }
    ]
  });
}
