require('dotenv').config()

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function send ({input, temperature = 0.7}) {    
const response = openai.responses.create({
    model: "gpt-4o-mini",
    input,
    temperature
  });
  
  const result = await response
  return result.output_text;
}

module.exports = {send}