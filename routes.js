module.exports = function(app) {
    var apis = require('./controllers/roonAPI');

    /**
     * @swagger
     * /roonAPI/getCore:
     *   get:
     *     description: Returns connected Roon Core information
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 display_name:
     *                   type: string
     *                 display_version:
     *                   type: string
     */
    app.get('/roonAPI/getCore', apis.getCore);

    /**
     * @swagger
     * /roonAPI/listZones:
     *   get:
     *     description: List all zones
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/listZones', apis.listZones);

    /**
     * @swagger
     * /roonAPI/listOutputs:
     *   get:
     *     description: List all audio outputs
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/listOutputs', apis.listOutputs);

    /**
     * @swagger
     * /roonAPI/getZone:
     *   get:
     *     description: Get zone details by zoneId
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/getZone', apis.getZone);

    /**
     * @swagger
     * /roonAPI/play_pause:
     *   get:
     *     description: Toggle play/pause for a zone
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/play_pause', apis.play_pause);

    /**
     * @swagger
     * /roonAPI/stop:
     *   get:
     *     description: Stop playback for a zone
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/stop', apis.stop);

    /**
     * @swagger
     * /roonAPI/previous:
     *   get:
     *     description: Skip to previous track
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/previous', apis.previous);

    /**
     * @swagger
     * /roonAPI/next:
     *   get:
     *     description: Skip to next track
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/next', apis.next);

    /**
     * @swagger
     * /roonAPI/change_volume:
     *   get:
     *     description: Set volume to an absolute value (0-100)
     *     parameters:
     *       - in: query
     *         name: outputId
     *         schema:
     *           type: string
     *         required: true
     *       - in: query
     *         name: volume
     *         schema:
     *           type: integer
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/change_volume', apis.change_volume);

    /**
     * @swagger
     * /roonAPI/change_volume_relative:
     *   get:
     *     description: Change volume relative to current
     *     parameters:
     *       - in: query
     *         name: outputId
     *         schema:
     *           type: string
     *         required: true
     *       - in: query
     *         name: volume
     *         schema:
     *           type: integer
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/change_volume_relative', apis.change_volume_relative);

    /**
     * @swagger
     * /roonAPI/mute:
     *   get:
     *     description: Mute an output (set volume to 0)
     *     parameters:
     *       - in: query
     *         name: outputId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/mute', apis.mute);

    /**
     * @swagger
     * /roonAPI/play:
     *   get:
     *     description: Start playback for a zone
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/play', apis.play);

    /**
     * @swagger
     * /roonAPI/pause:
     *   get:
     *     description: Pause playback for a zone
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/pause', apis.pause);

    /**
     * @swagger
     * /roonAPI/listByItemKey:
     *   get:
     *     description: Browse library by item key
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *       - in: query
     *         name: item_key
     *         schema:
     *           type: string
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: list_size
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/listByItemKey', apis.listByItemKey);

    /**
     * @swagger
     * /roonAPI/listSearch:
     *   get:
     *     description: Search the music library
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *       - in: query
     *         name: toSearch
     *         schema:
     *           type: string
     *       - in: query
     *         name: list_size
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/listSearch', apis.listSearch);

    /**
     * @swagger
     * /roonAPI/goUp:
     *   get:
     *     description: Browse up one level
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *       - in: query
     *         name: list_size
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/goUp', apis.goUp);

    /**
     * @swagger
     * /roonAPI/goHome:
     *   get:
     *     description: Browse to root level
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *       - in: query
     *         name: list_size
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/goHome', apis.goHome);

    /**
     * @swagger
     * /roonAPI/listGoPage:
     *   get:
     *     description: Go to a specific page in the current browse session
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: list_size
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/listGoPage', apis.listGoPage);

    /**
     * @swagger
     * /roonAPI/listRefresh:
     *   get:
     *     description: Refresh the current browse view
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/listRefresh', apis.listRefresh);

    /**
     * @swagger
     * /roonAPI/getInternetRadios:
     *   get:
     *     description: Search and auto-play internet radio stations
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *       - in: query
     *         name: toSearch
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/getInternetRadios', apis.getInternetRadios);

    /**
     * @swagger
     * /roonAPI/getMediumImage:
     *   get:
     *     description: Get a medium-sized image (640x480)
     *     parameters:
     *       - in: query
     *         name: image_key
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: Image binary
     */
    app.get('/roonAPI/getMediumImage', apis.getMediumImage);

    /**
     * @swagger
     * /roonAPI/getIcon:
     *   get:
     *     description: Get a small icon (100x100)
     *     parameters:
     *       - in: query
     *         name: image_key
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: Image binary
     */
    app.get('/roonAPI/getIcon', apis.getIcon);

    /**
     * @swagger
     * /roonAPI/getImage:
     *   get:
     *     description: Get a standard image (300x200)
     *     parameters:
     *       - in: query
     *         name: image_key
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: Image binary
     */
    app.get('/roonAPI/getImage', apis.getImage);

    /**
     * @swagger
     * /roonAPI/getOriginalImage:
     *   get:
     *     description: Get the original full-size image
     *     parameters:
     *       - in: query
     *         name: image_key
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: Image binary
     */
    app.get('/roonAPI/getOriginalImage', apis.getOriginalImage);

    /**
     * @swagger
     * /roonAPI/group:
     *   post:
     *     description: Group outputs into a zone
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               output:
     *                 type: array
     *                 items:
     *                   type: string
     *     responses:
     *       200:
     *         description: OK
     */
    app.post('/roonAPI/group', apis.group);

    /**
     * @swagger
     * /roonAPI/ungroup:
     *   post:
     *     description: Ungroup outputs from a zone
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               output:
     *                 type: array
     *                 items:
     *                   type: string
     *     responses:
     *       200:
     *         description: OK
     */
    app.post('/roonAPI/ungroup', apis.ungroup);

    /**
     * @swagger
     * /roonAPI/transferZone:
     *   get:
     *     description: Transfer playback from one zone to another
     *     parameters:
     *       - in: query
     *         name: fromZoneId
     *         schema:
     *           type: string
     *         required: true
     *       - in: query
     *         name: toZoneId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/transferZone', apis.transferZone);

    /**
     * @swagger
     * /roonAPI/getTimers:
     *   get:
     *     description: Get all scheduled timers
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/getTimers', apis.getTimers);

    /**
     * @swagger
     * /roonAPI/addTimer:
     *   get:
     *     description: Add a new timer
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *         required: true
     *       - in: query
     *         name: time
     *         schema:
     *           type: integer
     *         description: Unix timestamp in milliseconds
     *         required: true
     *       - in: query
     *         name: command
     *         schema:
     *           type: string
     *           enum: [play, pause]
     *         required: true
     *       - in: query
     *         name: isRepeat
     *         schema:
     *           type: integer
     *           enum: [0, 1]
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/addTimer', apis.addTimer);

    /**
     * @swagger
     * /roonAPI/removeTimer:
     *   get:
     *     description: Remove an existing timer
     *     parameters:
     *       - in: query
     *         name: zoneId
     *         schema:
     *           type: string
     *         required: true
     *       - in: query
     *         name: time
     *         schema:
     *           type: integer
     *         required: true
     *       - in: query
     *         name: command
     *         schema:
     *           type: string
     *           enum: [play, pause]
     *         required: true
     *       - in: query
     *         name: isRepeat
     *         schema:
     *           type: integer
     *           enum: [0, 1]
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     */
    app.get('/roonAPI/removeTimer', apis.removeTimer);
};
