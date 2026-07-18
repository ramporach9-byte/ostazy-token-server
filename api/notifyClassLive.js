const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }

  const { tokens, title, body, classId } = req.body;

  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    res.status(400).json({ error: 'tokens array is required' });
    return;
  }

  try {
    const message = {
      notification: { title, body },
      data: { classId: classId || '' },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    res.status(200).json({ success: true, sent: response.successCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
