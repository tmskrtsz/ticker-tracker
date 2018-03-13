const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatModelSchema = new Schema({
	id: {
		type: Number,
		unique: false,
		required: [true, "Chatroom ID must be saved"]
	},
	pick1: String,
	pick2: String,
	target: Number
})

ChatModelSchema.methods.addNew = function(chat_id, pick1, pick2, target) {
	//
}

module.exports = mongoose.model('ChatModel', ChatModelSchema);
