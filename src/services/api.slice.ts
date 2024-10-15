import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  OptionChainData,
  OptionChainTable,
} from "../features/optionChain/optionChain.type";
import {
  ContractInfo,
  Contracts,
  TokenMap,
} from "../features/contracts/contracts.type";

export interface GetOptionChainRequest {
  underlying: string;
  expiry: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),
  endpoints: (builder) => ({
    getContracts: builder.query<Contracts, void>({
      query: () => "/contracts", // ({ url: '/contracts', method: 'GET' }),
      transformResponse(res: any) {
        // const contracts = Object.keys(res);
        const contracts: Contracts = {};
        const tokenMap: TokenMap = {};
        for (const contract in res) {
          const expiries = Object.keys(res[contract]["OPT"]);

          for (const optInfo in res[contract]["OPT"]) {
            const expiryContractInfoArray = res[contract]["OPT"][optInfo];
            for (const tokenInfo of expiryContractInfoArray) {
              console.log(tokenInfo);
              tokenMap[tokenInfo["token"]] = {
                strike: tokenInfo["strike"],
                optionType: tokenInfo["option_type"],
              };
            }
          }
          expiries.sort();
          contracts[contract] = {
            id: contract,
            expiries,
            tokenMap,
          };
        }

        return contracts;
      },
    }),
    getOptionChain: builder.query<OptionChainData, GetOptionChainRequest>({
      query: ({ underlying, expiry }) =>
        `/option-chain-with-ltp?underlying=${underlying}`,
      async onCacheEntryAdded(
        arg,
        {
          updateCachedData,
          cacheDataLoaded,
          cacheEntryRemoved,
          getCacheEntry,
          getState,
        }
      ) {
        const ws = new WebSocket("wss://prices.algotest.xyz/mock/updates");

        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              msg: {
                type: "subscribe",
                datatypes: ["ltp"],
                underlyings: [
                  {
                    underlying: arg.underlying,
                    cash: true,
                    options: [arg.expiry],
                  },
                ],
              },
            })
          );
        };

        try {
          await cacheDataLoaded;

          ws.addEventListener("message", (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            const ltpData = data["ltp"];
          
            const getContractsData = api.endpoints.getContracts.select()(getState()).data;
          
            if (getContractsData) {
              const tokenMap = getContractsData[arg.underlying].tokenMap;
          
              updateCachedData((draft) => {
                if (draft && draft[arg.expiry]) {
                  const optionChainTable = draft[arg.expiry];
                  for (const tokenInfo of ltpData) {
                    const matchedTokenInfo = tokenMap[tokenInfo["token"]];
                    if (matchedTokenInfo) {
                      const tableRow =
                        optionChainTable[
                          `${arg.underlying}-${matchedTokenInfo.strike}-${arg.expiry}`
                        ];
                      if (tableRow) {
                        if (matchedTokenInfo.optionType === "CE") {
                          tableRow.callPrice = tokenInfo["ltp"];
                        } else if (matchedTokenInfo.optionType === "PE") {
                          tableRow.putPrice = tokenInfo["ltp"];
                        }
                      }
                    }
                  }
                }
              });
            }
          });
          
        } catch {}

        await cacheEntryRemoved;

        ws.close();
      },
      transformResponse(res: any) {
        // console.log(res);
        const optionChainData: OptionChainData = {};
        const tokenInfo: TokenMap = {};
        const options = res["options"];
        for (const expiry in options) {
          const strikes = options[expiry]["strike"] as number[];
          const callClose = options[expiry]["call_close"] as number[];
          const putClose = options[expiry]["put_close"] as number[];
          optionChainData[expiry] = {};
          strikes.map((strike, index) => {
            optionChainData[expiry][
              `${res["underlying"]}-${strike}-${expiry}`
            ] = {
              id: `${res["underlying"]}-${strike}-${expiry}`, // "$underlying-$strike-$expiry"
              callPrice: callClose[index],
              strike: strike,
              putPrice: putClose[index],
            };
          });
        }
        return optionChainData;
      },
    }),
  }),
});

export const { useGetContractsQuery, useGetOptionChainQuery } = api;
