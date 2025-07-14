const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERT = process.env.AGORA_APP_CERT;

router.get('/generate-token', (req, res) => {
  const { channel, uid } = req.query;

  if (!channel || !uid) {
    return res.status(400).json({ msg: 'Channel and UID are required' });
  }


  const role = RtcRole.PUBLISHER;
  const expireTime = 3600;
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

 
  const token = RtcTokenBuilder.buildTokenWithAccount(
    APP_ID,
    APP_CERT,
    channel,
    uid,
    role,
    privilegeExpireTime
  );


  res.json({ token });
});

module.exports = router;
