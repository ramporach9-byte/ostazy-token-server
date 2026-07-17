const { RtcTokenBuilder, RtcRole } = require('agora-token');

const APP_ID = 'b72834689283480dacd31102e1e94851';
const APP_CERTIFICATE = '712faef4700c4bef9dc00ed2c3ee768f';

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const channelName = req.query.channelName;
  const uid = req.query.uid || 0;

  if (!channelName) {
    res.status(400).json({ error: 'channelName is required' });
    return;
  }

  const expireSeconds = 3600;
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    Number(uid),
    RtcRole.PUBLISHER,
    expireSeconds,
    expireSeconds
  );

  res.status(200).json({ token: token });
};
