module.exports = function(req, res) {
    res.send({
        values : [1,2,3],
        text: 'Hello!'
    });
};