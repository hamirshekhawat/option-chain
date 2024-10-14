import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OptionChainData } from "../features/optionChain/optionChain.type";
import { ContractInfo } from "../features/contracts/contracts.type";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://prices.algotest.xyz/",
  }),
  endpoints: (builder) => ({
    getContracts: builder.query<ContractInfo[], void>({
      query: () => "/contracts", // ({ url: '/contracts', method: 'GET' }),
      transformResponse(res: any) {
        // const contracts = Object.keys(res);
        const contracts: ContractInfo[] = [];
        for (const key in res) {
          const expiries = Object.keys(res[key]["OPT"]);
          expiries.sort();
          contracts.push({
            id: key,
            expiries,
          });
        }

        return contracts;
      },
    }),
    getOptionChain: builder.query<OptionChainData, string>({
      query: (underlying: string) =>
        `/option-chain-with-ltp?underlying=${underlying}`,
      transformResponse(res: any) {
        // console.log(res);
        const optionChainData: OptionChainData = {};
        const options = res["options"];
        for (const key in options) {
          const strikes = options[key]["strike"] as number[];
          const callClose = options[key]["call_close"] as number[];
          const putClose = options[key]["put_close"] as number[];
          optionChainData[key] = [];
          strikes.map((value, index) => {
            optionChainData[key].push({
              id: `${res["underlying"]}-${value}-${key}`, // "$underlying-$strike-$expiry"
              callPrice: callClose[index],
              strike: value,
              putPrice: putClose[index],
            });
          });
        }
        return optionChainData;
      },
    }),
    // getMessages: build.query<Message[], Channel>({
    //   query: (channel) => `messages/${channel}`,
    //   async onCacheEntryAdded(
    //     arg,
    //     { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
    //   ) {
    //     // create a websocket connection when the cache subscription starts
    //     const ws = new WebSocket('ws://localhost:8080')
    //     try {
    //       // wait for the initial query to resolve before proceeding
    //       await cacheDataLoaded

    //       // when data is received from the socket connection to the server,
    //       // if it is a message and for the appropriate channel,
    //       // update our query result with the received message
    //       const listener = (event: MessageEvent) => {
    //         const data = JSON.parse(event.data)
    //         // if (!isMessage(data) || data.channel !== arg) return

    //         updateCachedData((draft) => {
    //           draft.push(data)
    //         })
    //       }

    //       ws.addEventListener('message', listener)
    //     } catch {
    //       // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
    //       // in which case `cacheDataLoaded` will throw
    //     }
    //     // cacheEntryRemoved will resolve when the cache subscription is no longer active
    //     await cacheEntryRemoved
    //     // perform cleanup steps once the `cacheEntryRemoved` promise resolves
    //     ws.close()
    //   },
    // }),
  }),
});
export const { useGetContractsQuery, useGetOptionChainQuery } = api;
// export const { useGetMessagesQuery } = api
