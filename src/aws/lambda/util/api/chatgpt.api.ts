import { Configuration, OpenAIApi } from "openai";

const useGPT = async (prompt: string) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0,
      max_tokens: 5,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: response.data,
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};

export { useGPT };
