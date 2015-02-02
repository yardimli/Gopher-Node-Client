var net = require('net');

exports.isPortOpen = function (_portNumber, _callBack) {
    var testServer = new net.createServer();
    testServer.listen(_portNumber);

    testServer.once('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            return _callBack(null, true);
        } else {
            return _callBack(err.toString(), null);
        }
    });

    testServer.once('listening', function () {
        testServer.close();
        return _callBack(null, false);
    });
};

exports.getAvailablePort = function (excludePort, _callBack) {
    var start = 1338, end = 2338;
    var stopSearching = false;
    var occupied = [];

    if (typeof _callBack !== 'function') {
        return {
            error: 'A callback function is not provided',
            port: null
        };
    }else {
        if (Array.isArray(excludePort)) {
            occupied = excludePort;
        }

        function checkPort(_port) {
            var server = new net.createServer();
            server.listen(_port);

            server.once('error', function (error) {
                start++;
                if (error.code === 'EADDRINUSE') {
                    if (start <= end && stopSearching === false) {
                        checkPort(start);
                    } else {
                        var result = {
                            error: 'Can not find an open port',
                            port: null
                        };
                        return _callBack(result);
                    }
                }
            });

            server.once('listening', function () {
                server.close();
                var countOccupied = 0;
                for (var i = 0; i < occupied.length; i++) {
                    if (occupied[i] === _port) {
                        countOccupied++;
                    }
                }

                if (stopSearching === false) {
                    if (countOccupied > 0) {
                        start++;
                        if (start <= end) {
                            checkPort(start);
                        }
                    } else {
                        stopSearching = true;
                        var result = {
                            error: null,
                            port: _port
                        };
                        return _callBack(result);
                    }
                }
            });
        }
        checkPort(start);
    }
};


