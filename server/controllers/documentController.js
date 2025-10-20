import Document from "../models/Document.js";
import { extractTextFromPDF } from "../services/pdfService.js";
import { generateSummary, answerQuestion } from "../services/aiService.js";
import fs from "fs";

// POST /api/documents/upload

export const uploadAndSummarizeDocument = async (req, res) => {
    if(!req.file) {
        return res.status(400).send({ message: "No file uploaded." });
    }
    const userId = req.user._id;
    const filePath = req.file.path;

    try{
        // 1.) Extract the Text
        const extractedText = await extractTextFromPDF(filePath);

        // 2. Generate Summary (This is the long-running AI call)
        const summary = await generateSummary(extractedText);

        // Save to db
        const newDocument = new Document({
            filename : req.file.originalname,
            user: userId,
            extractedText : extractedText,
            summary : summary,
        });
        await newDocument.save();

        // $.) respond to client
        res.status(201).json({
            id: newDocument._id,
            filename: newDocument.filename,
            summary: newDocument.summary,
            // extractedText is large, so generally don't send back in full response
        });
    }
    catch(error){
        console.error('Error in upload and summarization:', error);
        res.status(500).json({ message: 'Server error during processing.' });
    }
    finally {
        // 5. Clean up the temporary file
        fs.unlinkSync(filePath); 
    }
};

// POST /api/documents/:id/qa

export const handleQuestion = async (req, res) => {
    const { question } = req.body;
    const { id } = req.params;

    try{
        const document = await Document.findById(id);
        if(!document){
            return res.status(404).json({ message: 'Document not found' });
        }

        // 1.) Use document text as context for the answer
        const answer = await answerQuestion(document.extractedText, question);

        // 2. Save Q&A to history in MongoDB
        document.qaHistory.push({ question, answer });
        await document.save();

        // 3. Respond
        res.status(200).json({ answer, history: document.qaHistory });
    }
    catch (error) {
        console.error('Error during Q&A:', error);
        res.status(500).json({ message: 'Server error during Q&A processing.' });
    }
};

// GET /api/documents/:id

export const getDocumentDetails = async (req, res) => {
    try{
        const document = await Document.findById(req.params.id).select('-extractedText');
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
}

// GET /api/documents/

export const getUserDocuments =  async (req,res) => {
        // req.user is set by your 'protect' middleware after authentication
        try{
            const documents = await Document.find({user : req.user._id}).select('filename summary qaHistory createdAt').sort({ createdAt: -1 });
            res.status(200).json(documents);
        }
        catch(error){
            console.error('Error fetching user documents:', error);
        res.status(500).json({ message: 'Failed to retrieve document history.' });
        }
}
