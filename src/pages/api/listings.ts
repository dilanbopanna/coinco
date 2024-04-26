// pages/api/cryptocurrencies.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

type ApiResponse = {
  message?: string;
  [key: string]: any; // since the structure of CoinMarketCap's response might be dynamic
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { start = "1", limit = "100", convert = "USD" } = req.query;

  const url = `${process.env.CMC_ENDPOINT}/v1/cryptocurrency/listings/latest`;
  const params = new URLSearchParams({
    start: start.toString(),
    limit: limit.toString(),
    convert: convert.toString(),
  });

  try {
    const apiResponse = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY as string, // Ensure non-null string value
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`Error: ${apiResponse.status}`);
    }

    const data: any = await apiResponse.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
