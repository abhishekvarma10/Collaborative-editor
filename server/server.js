// server/server.js

// -------------------- Imports --------------------
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const { QuillDeltaToHtmlConverter } = require('quill-delta-to-html');
const Document = require('./Document');
const { Document: DocxDocument, Packer, Paragraph, TextRun } = require('docx');

// -------------------- Database Connection --------------------
const MONGODB_URI = "mongodb://localhost:27017/document-db";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to local MongoDB"))
  .catch(err => console.error("❌ Could not connect to MongoDB:", err));

// -------------------- Express & Socket.IO Setup --------------------
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;
const defaultValue = "";

// -------------------- REST API Routes --------------------

// Get all documents (ID and title)
app.get("/api/documents", async (req, res) => {
  try {
    const documents = await Document.find({}, "_id title");
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download a document as PDF or DOCX
app.get("/api/documents/:id/download", async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query; // ?format=pdf OR ?format=doc
    const document = await Document.findById(id);

    if (!document) return res.status(404).send("Document not found");

    const converter = new QuillDeltaToHtmlConverter(document.data.ops, {});
    const html = converter.convert();
    const text = html.replace(/<[^>]*>/g, " ");

    if (format === "doc") {
      // Generate DOCX
      const doc = new DocxDocument({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun({ text: document.title || "Untitled Document", bold: true, size: 32 })],
                alignment: "center",
              }),
              new Paragraph({}),
              new Paragraph({
                children: [new TextRun(text)],
              }),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="${document.title || "document"}.docx"`);
      return res.send(buffer);

    } else {
      // Default: Generate PDF
      const pdf = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${document.title || "document"}.pdf"`);

      pdf.pipe(res);
      pdf.fontSize(24).text(document.title || "Untitled Document", { align: "center" });
      pdf.moveDown();
      pdf.fontSize(12).text(text);
      pdf.end();
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- Socket.IO Events --------------------
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on("join-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);

    socket.emit("load-document", document);

    socket.on("send-changes", (delta) => {
      socket.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });

    socket.on("save-title", async (title) => {
      await Document.findByIdAndUpdate(documentId, { title });
    });
  });
});

// -------------------- Helper Functions --------------------
async function findOrCreateDocument(id) {
  if (id == null) return;
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}


server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
