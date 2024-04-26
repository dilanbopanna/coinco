import useFetch from "@/utils/useFetch";

function DataTable({ data }: any) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Slug</th>
          <th>Rank</th>
          <th>Market Pairs</th>
          <th>Circulating Supply</th>
          <th>Total Supply</th>
          <th>Max Supply</th>
          <th>USD Price</th>
          <th>Market Cap</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.symbol}</td>
            <td>{item.slug}</td>
            <td>{item.cmc_rank}</td>
            <td>{item.num_market_pairs}</td>
            <td>{item.circulating_supply}</td>
            <td>{item.total_supply}</td>
            <td>{item.max_supply}</td>
            <td>{item.quote.USD.price.toFixed(2)}</td>
            <td>{item.quote.USD.market_cap.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Page() {
  const {
    data,
    mutate: refetch,
    isValidating,
  } = useFetch<any>({
    key: "/api/listings",
    fetchOptions: {
      params: {
        start: "1",
        limit: "100",
        convert: "USD",
      },
    },
  });
  return (
    <h1 className="text-red-600">{data && <DataTable data={data.data} />}</h1>
  );
}
