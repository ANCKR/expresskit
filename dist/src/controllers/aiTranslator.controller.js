"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiTranslatorfn = void 0;
const asyncHandeler_1 = __importDefault(require("../utils/asyncHandeler"));
const generative_ai_1 = require("@google/generative-ai");
const ApiResponse_1 = require("../utils/ApiResponse");
const customError_1 = require("../utils/customError");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.AI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});
exports.aiTranslatorfn = (0, asyncHandeler_1.default)(async (req, res) => {
  try {
    const { userPrompt, language } = req.body;
    const prompt = `Translate this following into ${language} language : ${userPrompt} `;
    const result = await model.generateContent([prompt]);
    return res
      .status(200)
      .json(new ApiResponse_1.ApiResponse(200, result.response.text()));
  } catch (error) {
    throw (0, customError_1.createCustomError)(error);
  }
});
