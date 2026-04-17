import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyBCGq_klydR5ZkMQ-ma_lelm2tDFnw3b-o' });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Analyze this Bible verse: "John 11:35 - Jesus wept." and give me 3 ultra-short comma-separated keywords for its mood.',
    });

    console.log('Success!', response.text);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
