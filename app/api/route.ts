import { CoingeckoCoinData } from "@/types/coingecko.type";
import { imageUrlToBase64 } from "@/app/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");

  const response = await fetch(
    "https://api.coingecko.com/api/v3/" +
      "coins/markets?" +
      "vs_currency=usd" +
      "&order=market_cap_desc" +
      "&per_page=100" +
      `&page=${1}` +
      "&sparkline=true" +
      "&price_change_percentage=1h%2C24h%2C7d%2C30d%2C1y" +
      "&locale=en" +
      `&x_cg_demo_api_key=${process.env.COINGECKO_API_SECRET_KEY}`
  );

  const data = (await response.json()) as CoingeckoCoinData[];

  const transformedData = await Promise.all(
    data.map(async (item) => {
      const dataUrl = await imageUrlToBase64(item.image);

      return { ...item, image: dataUrl };
    })
  );

  console.log(transformedData);

  return Response.json({ data: transformedData });
}

// async function getCoinsByPage(
//   page: number
// ): Promise<CoingeckoCoinData[] | null> {
//   const { data } = await fetch(
//     this.BASE_URL +
//       "coins/markets?" +
//       "vs_currency=usd" +
//       "&order=market_cap_desc" +
//       "&per_page=100" +
//       `&page=${page}` +
//       "&sparkline=true" +
//       "&price_change_percentage=1h%2C24h%2C7d%2C30d%2C1y" +
//       "&locale=en" +
//       `&x_cg_demo_api_key=${process.env.COINGECKO_API_SECRET_KEY}`
//   );

//   const transformedData = await Promise.all(
//     data.map(async (item) => {
//       const dataUrl = await imageUrlToBase64(item.image);

//       return { ...item, image: dataUrl };
//     })
//   );

//   return transformedData;
// }

// async function getCoin(id: string) {
//   const { data } = await fetch(
//     BASE_URL +
//       `coins/${id}?` +
//       "localization=false" +
//       "&tickers=true" +
//       "&market_data=true" +
//       "&community_data=true"
//   );

//   return data;
// }

// async function getCoinHistory(id: string) {
//   const response = await fetch(
//     `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=max`
//   );
//   const { market_caps, total_volumes, prices } = response.data;
//   const res = prices.map((item: [number, number], index: number) => {
//     item.push(total_volumes[index][1]);
//     item.push(market_caps[index][1]);
//     return item;
//   });
//   return res;
// }
