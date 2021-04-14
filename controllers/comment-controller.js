const { Comment, Pizza } = require('../models');

const commentController = {
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        );
      })
        .then(dbPizzaData => {
          if (!dbPizzaData) {
            return res.status(404).json({ message: "No pizza found with this id!" })
          }

          return res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
  },

  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true }
    )
      .then(dbCommentData => {
        if (!dbCommentData) {
          return res.status(404).json({ message: 'No comment found with this id!' });
        }

        res.json(dbCommentData);
      })
      .catch(err => res.json(err));
  },

  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(deletedComment => {
        if (!deletedComment) {
          return res.status(404).json({ message: "No comment with this id found!" })
        }

        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId }},
          { new: true }
        )
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          return res.status(404).json({ message: "No Pizza found with this id!" });
        }

        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  removeReply({ parmas }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(deletedReply => {
        if (!deletedReply) {
          return res.status(404).json({ message: 'No reply found with this id!' });
        }

        res.json(deletedReply);
      })
      .catch(err => res.json(err));
  }
}

module.exports = commentController;
