import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { embeddingModel } from '../services/aiService.js';
import { collection } from '../config/db.js';

/**
 * @desc    Uploads a document, processes it, and indexes it for RAG.
 * @route   POST /api/documents/upload
 * @access  Protected
 */
export const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
   
    const pdf = (await import('pdf-parse')).default;
    const pdfData = await pdf(req.file.buffer);
    
    const text = pdfData.text;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
    });
    const documents = await splitter.createDocuments([text]);


    await MongoDBAtlasVectorSearch.fromDocuments(
      documents,
      embeddingModel, 
      {
        collection: collection('vectors'),
        indexName: "default",
        textKey: "text",
        embeddingKey: "embedding",
        metadata: { userId: req.user.id }
      }
    );

    res.status(200).json({ message: 'File has been successfully indexed.' });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Error processing document.' });
  }
};