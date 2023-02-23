import type { NextApiRequest, NextApiResponse } from 'next'

// opanAI
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const getProducts = async (inputValue: string) => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: 'Extract the products out of this text, with no additional words, separated by commas: ' + inputValue,
      temperature: 0,
      max_tokens: 550,
    });
  
    if (!response.data.choices[0].text) {
      // handle the case where the response is undefined
      return [];
    }
  
    const products = response.data.choices[0].text.split('\n');
  
    const productsArray = products[products.length - 1]
                          .split(',')
                          .map((i:any) => i.trim());
    console.log('productsArray');
    console.log(productsArray);
  
    return productsArray;
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log('you sent - getProducts =>' + req.body.string);

        const data = await getProducts(req.body.string);
        const responseData = { object: data };
        res.status(200).json(responseData);
    } catch (error) {
        const errorAsError = error as Error;
        const responseData = { message: errorAsError.message};
        res.status(404).json(responseData);
    }
}