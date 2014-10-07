var mongoose = require('mongoose'),
    Report = mongoose.model('Report');

module.exports = {
    getAllReports : function(req, res, next) {
        Report.find({owner: req.user._id}).exec(function(err, userReports) {
            if (err) {
                console.log('Game reports could not be loaded ' + err);
                return;
            }

            if (!userReports) {
                console.log('Un-existing user required his game reports');
                res.status(404);
                res.end();
                return;
            }

            res.send({
                reports : userReports,
                success : true
            });
        });
    },
    removeReport: function(req, res, next) {
        Report.findById(req.body.reportId, function(err, report) {
            if (err) {
                console.log('Game report could not be found ' + err);
                return;
            }

            if (report === null || report.owner.toString() !== req.user._id.toString()) {
                res.send({
                    success : false,
                    reason: 'This is not your report'
                });
            }

            report.remove(function(err) {
                if (err) {
                    console.log('Game report could not be removed ' + err);
                    return;
                }

                res.send({
                    report : report,
                    success : true
                });
            })
        });
    }
};