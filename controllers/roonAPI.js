var RoonApi          = require("node-roon-api");
var RoonApiTransport = require("node-roon-api-transport");
var RoonApiStatus    = require("node-roon-api-status");
var RoonApiImage     = require("node-roon-api-image");
var RoonApiBrowse    = require("node-roon-api-browse");

var path = require('path');

var core;
var timeout;

var roon = new RoonApi({
   extension_id     : "com.pierpaolopernici.roon-http-api",
   display_name     : "roon-http-api",
   display_version  : "1.1.0",
   publisher        : "Pierpaolo Pernici",
   email            : "pierpaolo.pernici@gmail.com",
   log_level        : "none",

   core_paired: function(core_) {
     core = core_;
     core.services.RoonApiTransport.subscribe_zones((response, msg) => {
     });
   },

   core_unpaired: function(core_) {
     core = null;
   }
});

var svc_status = new RoonApiStatus(roon);

roon.init_services({
   required_services: [ RoonApiTransport, RoonApiBrowse, RoonApiImage ],
   provided_services: [ svc_status ],
});

svc_status.set_status("Extension enabled", false);
roon.start_discovery();


// --------------- Helpers ------------------

var FAILURE_MESSAGE          = "fail";
var SUCCESS_MESSAGE          = "success";
var CORE_NOT_CONNECTED_MESSAGE = "core_not_connected";

function requireCore(res) {
  if (!core) {
    res.send({ status: CORE_NOT_CONNECTED_MESSAGE });
    return false;
  }
  return true;
}

function callRoonControl(zoneId, command, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.control(zoneId, command);
  res.send({ "status": SUCCESS_MESSAGE });
}

function callRoonGet(method, key, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport[method]((iserror, body) => {
    if (!iserror) {
      var result = {};
      result[key] = body[key];
      res.send(result);
    } else {
      res.send({ status: FAILURE_MESSAGE });
    }
  });
}


// --------------- Transport APIs ------------------

exports.getCore = function(req, res) {
  if (!requireCore(res)) return;
  res.send({
    "id": core.core_id,
    "display_name": core.display_name,
    "display_version": core.display_version
  });
};

exports.listZones = function(req, res) {
  callRoonGet("get_zones", "zones", res);
};

exports.listOutputs = function(req, res) {
  callRoonGet("get_outputs", "outputs", res);
};

exports.getZone = function(req, res) {
  if (!requireCore(res)) return;
  res.send({
    "zone": core.services.RoonApiTransport.zone_by_zone_id(req.query['zoneId'])
  });
};

exports.play_pause = function(req, res) {
  callRoonControl(req.query['zoneId'], 'playpause', res);
};

exports.stop = function(req, res) {
  callRoonControl(req.query['zoneId'], 'stop', res);
};

exports.play = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.control(req.query['zoneId'], 'play');
  res.send({ "zone": "Success" });
};

exports.pause = function(req, res) {
  callRoonControl(req.query['zoneId'], 'pause', res);
};

exports.previous = function(req, res) {
  callRoonControl(req.query['zoneId'], 'previous', res);
};

exports.next = function(req, res) {
  callRoonControl(req.query['zoneId'], 'next', res);
};

exports.change_volume = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.change_volume(req.query['outputId'], "absolute", req.query['volume']);
  res.send({ "status": SUCCESS_MESSAGE });
};

exports.change_volume_relative = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.change_volume(req.query['outputId'], "relative", req.query['volume']);
  res.send({ "status": SUCCESS_MESSAGE });
};

exports.mute = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.change_volume(req.query['outputId'], "absolute", 0);
  res.send({ "status": SUCCESS_MESSAGE });
};

exports.seek = function(req, res) {
  if (!requireCore(res)) return;
  var how = req.query['how'] || 'absolute';
  core.services.RoonApiTransport.seek(req.query['zoneId'], how, parseFloat(req.query['seconds']));
  res.send({ "status": SUCCESS_MESSAGE });
};

exports.standby = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.standby(req.query['outputId'], {});
  res.send({ "status": SUCCESS_MESSAGE });
};

exports.wake = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.convenience_switch(req.query['outputId'], {});
  res.send({ "status": SUCCESS_MESSAGE });
};

exports.zoneSettings = function(req, res) {
  if (!requireCore(res)) return;
  var settings = {};
  if (req.query['shuffle'] !== undefined) settings.shuffle = req.query['shuffle'] === 'true';
  if (req.query['loop'] !== undefined)     settings.loop = req.query['loop'];
  if (req.query['auto_radio'] !== undefined) settings.auto_radio = req.query['auto_radio'] === 'true';
  core.services.RoonApiTransport.change_settings(req.query['zoneId'], settings);
  res.send({ "status": SUCCESS_MESSAGE });
};

exports.pauseAll = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.pause_all();
  res.send({ "status": SUCCESS_MESSAGE });
};

exports.muteAll = function(req, res) {
  if (!requireCore(res)) return;
  var how = req.query['how'] || 'mute';
  core.services.RoonApiTransport.mute_all(how);
  res.send({ "status": SUCCESS_MESSAGE });
};


// --------------- Image APIs ------------------

exports.getMediumImage = function(req, res) {
  get_image(req.query['image_key'], "fit", 640, 480, "image/jpeg", res);
};

exports.getIcon = function(req, res) {
  get_image(req.query['image_key'], "fit", 100, 100, "image/jpeg", res);
};

exports.getImage = function(req, res) {
  get_image(req.query['image_key'], "fit", 300, 200, "image/jpeg", res);
};

exports.getOriginalImage = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiImage.get_image(req.query['image_key'], function(cb, contentType, body) {
    res.contentType = contentType;
    res.writeHead(200, {'Content-Type': 'image/jpeg' });
    res.end(body, 'binary');
  });
};

function get_image(image_key, scale, width, height, format, res) {
  if (!core) { res.send({ status: CORE_NOT_CONNECTED_MESSAGE }); return; }
  core.services.RoonApiImage.get_image(image_key, {scale, width, height, format}, function(cb, contentType, body) {
    res.contentType = contentType;
    res.writeHead(200, {'Content-Type': 'image/jpeg' });
    res.end(body, 'binary');
  });
};


// --------------- Browse APIs ------------------

exports.listByItemKey = function(req, res) {
  refresh_browse(req.query['zoneId'], { item_key: req.query['item_key'] }, req.query['page'], req.query['list_size'], function(myList) {
    res.send({ "list": myList });
  });
};

exports.listSearch = function(req, res) {
  refresh_browse(req.query['zoneId'], { item_key: req.query['item_key'], input: req.query['toSearch'] }, req.query['page'], req.query['list_size'], function(myList) {
    res.send({ "list": myList });
  });
};

exports.goUp = function(req, res) {
  refresh_browse(req.query['zoneId'], { pop_levels: 1 }, 1, req.query['list_size'], function(myList) {
    res.send({ "list": myList });
  });
};

exports.goHome = function(req, res) {
  refresh_browse(req.query['zoneId'], { pop_all: true }, 1, req.query['list_size'], function(myList) {
    res.send({ "list": myList });
  });
};

exports.listGoPage = function(req, res) {
  load_browse(req.query['page'], req.query['list_size'], function(myList) {
    res.send({ "list": myList });
  });
};

exports.listRefresh = function(req, res) {
  refresh_browse(req.query['zoneId'], { refresh_list: true }, 0, 0, function(myList) {
    res.send({ "list": myList });
  });
};


// --------------- Internet Radio (from CaseyRo fork) ------------------

exports.getInternetRadios = function(req, res) {
  if (!requireCore(res)) return;
  refreshInternetRadioBrowse({ input: req.query['toSearch'], zone_or_output_id: req.query['zoneId'] }, function(myList) {
    res.send({ "list": myList });
  });
};

function refreshInternetRadioBrowse(opts, cb) {
  opts = Object.assign({ hierarchy: 'internet_radio' }, opts);

  core.services.RoonApiBrowse.browse(opts, (err, r) => {
    if (err) { console.log(err, r); return; }

    if (r.action === 'list') {
      core.services.RoonApiBrowse.load({ hierarchy: 'internet_radio' }, (err, r) => {
        if (err) { console.log(err, r); return; }

        var items = r.items;
        if (opts.input) {
          var index = items.findIndex(function(x) { return x.title === opts.input; });
          if (index !== undefined) items = items.slice(index, index + 1);
        }

        cb(items);

        // If only one station matched and a zone is specified, auto-play it
        if (items.length === 1 && opts.zone_or_output_id) {
          var browseOpts = Object.assign({ hierarchy: 'internet_radio', item_key: items[0].item_key }, opts);
          core.services.RoonApiBrowse.browse(browseOpts, function(err, r) {
            if (err) console.log(err, r);
          });
        }
      });
    }
  });
}


// --------------- Group / Ungroup / Transfer ------------------

exports.group = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.group_outputs(req.body.output);
  res.send({ "status": SUCCESS_MESSAGE });
};

exports.ungroup = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.ungroup_outputs(req.body.output);
  res.send({ "status": SUCCESS_MESSAGE });
};

exports.transferZone = function(req, res) {
  if (!requireCore(res)) return;
  core.services.RoonApiTransport.transfer_zone(req.query['fromZoneId'], req.query['toZoneId']);
  res.send({ "status": SUCCESS_MESSAGE });
};


// --------------- Timers ------------------

exports.addTimer = function(req, res) {
  save_timer(req.query['zoneId'], req.query['time'], req.query['command'], req.query['isRepeat']);
  run_later();
  var timers = get_timers();
  res.send({ "timers": timers });
};

exports.getTimers = function(req, res) {
  var timers = get_timers();
  res.send({ "timers": timers });
};

exports.removeTimer = function(req, res) {
  var timers = get_timers();
  var zoneToRemove   = req.query['zoneId'];
  var timeToRemove   = req.query['time'];
  var commandToRemove = req.query['command'];
  var isRepeatToRemove = req.query['isRepeat'];

  for (var i in timers) {
    if (timers[i].zoneId == zoneToRemove && timers[i].time == timeToRemove &&
        timers[i].command == commandToRemove && timers[i].isRepeat == isRepeatToRemove) {
      timers.splice(i, 1);
      break;
    }
  }

  roon.save_config("my_timers", timers);
  run_later();
  var timers = get_timers();
  res.send({ "timers": timers });
};


// --------------- Internal helpers ------------------

function refresh_browse(zone_id, opts, page, listPerPage, cb) {
  if (!core) { cb([]); return; }

  var items = [];
  opts = Object.assign({
    hierarchy:          "browse",
    zone_or_output_id:  zone_id,
  }, opts);

  core.services.RoonApiBrowse.browse(opts, function(err, r) {
    if (err) { console.log(err, r); return; }

    if (r.action == 'list') {
      page = (page - 1) * listPerPage;

      core.services.RoonApiBrowse.load({
        hierarchy:          "browse",
        offset:             page,
        set_display_offset: listPerPage,
      }, function(err, r) {
        items = r.items;
        cb(r.items);
      });
    }
  });
}

function load_browse(page, listPerPage, cb) {
  if (!core) { cb([]); return; }

  page = (page - 1) * listPerPage;

  core.services.RoonApiBrowse.load({
    hierarchy:          "browse",
    offset:             page,
    set_display_offset: page,
  }, function(err, r) {
    cb(r.items);
  });
}

function get_timers() {
  var run_laters = roon.load_config("my_timers");
  return run_laters;
}

function save_timer(zoneId, time, command, isRepeat) {
  var timers = get_timers();
  if (timers == null) { timers = []; }

  var toAdd = {};
  toAdd.zoneId   = zoneId;
  toAdd.time     = time;
  toAdd.command  = command;
  toAdd.isRepeat = isRepeat;
  timers.push(toAdd);

  roon.save_config("my_timers", timers);
  refresh_timer();
}

function refresh_timer() {
  var timers = get_timers();
  var dateNow = new Date();
  var newTimers = [];

  for (var i in timers) {
    if (timers[i].time >= dateNow.getTime()) {
      newTimers.push(timers[i]);
    }
  }
  newTimers.sort(compare);
  roon.save_config("my_timers", newTimers);
}

function compare(a, b) {
  if (a.time < b.time) return -1;
  if (a.time > b.time) return 1;
  return 0;
}

function run_later() {
  clearTimeout(timeout);

  var timers = get_timers();
  var timer;

  if (timers != null && timers.length > 0) {
    timer = timers[0];
    var date   = new Date(parseInt(timer.time));
    var curDate = new Date();
    var lapse  = date - curDate;

    if (timer.command == "play") {
      timeout = setTimeout(function() {
        playZone(timer.zoneId);
        run_later();
      }, lapse);
    } else if (timer.command == "pause") {
      timeout = setTimeout(function() {
        pauseZone(timer.zoneId);
        run_later();
      }, lapse);
    }
  }
}

function playZone(zoneId) {
  if (!core) return;
  refresh_timer();
  core.services.RoonApiTransport.control(zoneId, 'play');
}

function pauseZone(zoneId) {
  if (!core) return;
  refresh_timer();
  core.services.RoonApiTransport.control(zoneId, 'pause');
}
