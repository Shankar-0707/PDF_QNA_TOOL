import mongoose from "mongoose";

const qaHistorySchema = new mongoose.Schema({
    question : {type : String, required : true},
    answer : {type : String, required : true},
    timestamp : {type : Date, default : Date.now}
})

const documentSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Link the document to the user
    },
    extractedText: { type: String, required: true },
    summary: { type: String },
    qaHistory: [qaHistorySchema] // Embedded array for Q&A history
}, {
    timestamps: true
});

const Document = mongoose.model('Document', documentSchema);
export default Document;