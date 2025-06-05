
const express=require("express");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");
const axios=require("axios");
const cors = require("cors");

const multer = require("multer");
const upload = multer();


const pdfParse=require("pdf-parse");  
dotenv.config();
const app=express();
app.use(cors()); 
app.use(bodyParser.json());

const applicationSchema=new mongoose.Schema({
  name:String,
  email:String,
  education:{
    degree:String,
    branch:String,
    institution:String,
    year:String,
  },
  experience:{
    job_title:String,
    company:String,
  },
  skills:[String],
  summary:String,
});
const Applicant=mongoose.model("Applicant",applicationSchema);


app.post("/enrichresume/upload", upload.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const data = await pdfParse(req.file.buffer);
    const raw_text = data.text;

    if (!raw_text || raw_text.trim().length === 0) {
      return res.status(500).json({ error: "No readable text in the PDF" });
    }

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Extract the following details from the given resume text and return in strict JSON format.
                  Return only valid JSON without any additional text:
                  ${JSON.stringify({
                    name: "string",
                    email: "string",
                    education: {
                      degree: "string",
                      branch: "string",
                      institution: "string",
                      year: "number"
                    },
                    experience: {
                      job_title: "string",
                      company: "string",
                      start_date: "string",
                      end_date: "string"
                    },
                    skills: ["string"],
                    summary: "string"
                  })}
                  Resume Text: ${raw_text}`,
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const responseText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      return res.status(500).json({ error: "Invalid response from AI service" });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, ''));
    } catch (pE) {
      return res.status(500).json({ error: "Failed to parse AI response", details: pE.message });
    }

    const applicant = new Applicant({
      name: parsedData.name,
      email: parsedData.email,
      education: parsedData.education,
      experience: parsedData.experience,
      skills: parsedData.skills,
      summary: parsedData.summary,
    });

    await applicant.save();
    res.status(200).json({ message: "Resume saved successfully", id: applicant._id });

  } catch (err) {
    console.error("Error processing uploaded resume:", err.message);
    res.status(500).json({ error: "Failed to process uploaded resume" });
  }
});



app.get("/applicant/:id", async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) return res.status(404).json({ error: "Not found" });
    console.log(applicant)
    res.status(200).json(applicant);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applicant" });
  }
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Listening on port 4000 and connected to DB");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

module.exports = app;
