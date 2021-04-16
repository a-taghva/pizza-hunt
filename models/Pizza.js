const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: "You need to prove a pizza name",
      trim: true
    },
    createdBy: {
      type: String,
      required: "You need to provide creator",
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      // enumerable -> refers to a set of data that can be iterated over
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra large'],
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  // return this.comments.length;
  // return this.comments.length + this.comments.replies.length();
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
})

const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;
