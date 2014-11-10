exports.getProjects = function (projectID, db, callBack) {
    db.serialize(function () {
        var result = [];
        var qSelectProject = '';
        if (projectID === 0) {
            qSelectProject = 'select ID, name FROM projects ORDER BY name ASC';
        } else {
            qSelectProject = 'select ID, name FROM projects WHERE ID=' + projectID;
        }
        db.each(qSelectProject, function (err, row) {
            result.push(row);
        }, function complete() {
            return callBack(result);
        });
    });
};