const _ = require('lodash');
const { Comment } = require('../../models/comment.model');

var setComments = (req, res) => {
    var body = _.pick(req.body, ['comment', 'filmId']);
    body.userId = req.user._id;
    var comment = new Comment(body);

    comment.save().then((r) => {
        res.send(r);
    }).catch(e => {
        res.send(e);
    });
}

var getComments = async (req, res) => {
    let id = req.params.id;

    Comment.find({ 'filmId': id }).populate('userId', 'firstname lastname username').exec(function(err, result) {
            if (err) {
                res.status(400).send(err);
            } else if (!result) {
                res.status(400).send({ code: 3242, text: 'No comments.'});
            } else {
                res.send(result);
            }
        });
}

var deleteComment = (req, res) => {
    let id = req.params.id;

    Comment.deleteOne({ _id: id }, (err) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send({ text: "Success"});
        }
    });
}

module.exports = {
    setComments,
    getComments,
    deleteComment
}