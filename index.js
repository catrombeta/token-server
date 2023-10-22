const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const PORT = 3000;

const APP_ID = "6409792f39fb41d7ad512d0309c5385a";
const APP_CERTIFICATE = "be1e246d6e524b0295c13264ec741c3d";

const app = express();

const nocache = (req, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
};

const generateAccessToken = (req, resp) => {
    // set response header
    resp.header('Access-Control-Allow-Origin', '*');

    // get channel name
    const channelName = "projeto_nos";
    if (!channelName) {
        return resp.status(500).json({ 'error': 'channel is required' });
    }

    // get uid
    let uid = req.query.uid;
    if (!uid || uid == '') {
        uid = 0;
    }

    // get role
    let role = RtcRole.PUBLISHER;

    // get the expire time
    let expirationTimeInSeconds = 3600;
    if (!expirationTimeInSeconds || expirationTimeInSeconds == '') {
        expirationTimeInSeconds = 3600;
    } else {
        expirationTimeInSeconds = parseInt(expirationTimeInSeconds, 10);
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expirationTimeInSeconds;

    // build the token
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);

    resp.json({
        'token': token
    });
};

app.get('/access_token', nocache, generateAccessToken);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});