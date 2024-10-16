import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import fetchMock from "jest-fetch-mock";
import { WebSocket, Server } from "mock-socket";
import { api } from "./api.slice";
import { waitFor } from "@testing-library/react";

process.env.REACT_APP_BASE_URL = "http://localhost";

fetchMock.enableMocks();

(global as any).WebSocket = WebSocket;

const mockContractsResponse = {
  NIFTY: {
    OPT: {
      "2023-12-28": [
        {
          token: "12345",
          strike: 18000,
          option_type: "CE",
        },
        {
          token: "12346",
          strike: 18000,
          option_type: "PE",
        },
      ],
    },
  },
};

const expectedContractsData = {
  NIFTY: {
    id: "NIFTY",
    expiries: ["2023-12-28"],
    tokenMap: {
      "12345": { strike: 18000, optionType: "CE" },
      "12346": { strike: 18000, optionType: "PE" },
    },
  },
};

const mockOptionChainResponse = {
  underlying: "NIFTY",
  options: {
    "2023-12-28": {
      strike: [18000, 18050],
      call_close: [100, 95],
      put_close: [90, 85],
    },
  },
};

const expectedOptionChainData = {
  "2023-12-28": {
    "NIFTY-18000-2023-12-28": {
      id: "NIFTY-18000-2023-12-28",
      callPrice: 100,
      strike: 18000,
      putPrice: 90,
    },
    "NIFTY-18050-2023-12-28": {
      id: "NIFTY-18050-2023-12-28",
      callPrice: 95,
      strike: 18050,
      putPrice: 85,
    },
  },
};

describe("API tests", () => {
  let store: any;

  beforeEach(() => {
    fetchMock.resetMocks();

    store = configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    });
  });

  test("getContracts", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockContractsResponse));

    const result = await store.dispatch(api.endpoints.getContracts.initiate());

    const contractsSelector = api.endpoints.getContracts.select();

    const { data, isSuccess } = contractsSelector(store.getState());

    expect(isSuccess).toBe(true);
    expect(data).toEqual(expectedContractsData);
  });

  test("getOptionChain", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockContractsResponse));

    await store.dispatch(api.endpoints.getContracts.initiate());

    const mockServer = new Server("wss://prices.algotest.xyz/mock/updates");

    fetchMock.mockResponseOnce(JSON.stringify(mockOptionChainResponse));

    await store.dispatch(
      api.endpoints.getOptionChain.initiate({
        underlying: "NIFTY",
        expiry: "2023-12-28",
      })
    );

    const optionChainSelector = api.endpoints.getOptionChain.select({
      underlying: "NIFTY",
      expiry: "2023-12-28",
    });

    await waitFor(() => {
      const { isSuccess } = optionChainSelector(store.getState());
      expect(isSuccess).toBe(true);
    });

    const { data, isSuccess } = optionChainSelector(store.getState());

    expect(isSuccess).toBe(true);
    expect(data).toEqual(expectedOptionChainData);

    const ltpUpdate = {
      ltp: [
        {
          token: "12345",
          ltp: 105,
        },
        {
          token: "12346",
          ltp: 88,
        },
      ],
    };

    mockServer.emit("message", JSON.stringify(ltpUpdate));

    await waitFor(() => {
      const updatedData = optionChainSelector(store.getState()).data;
      if (!updatedData) return;
      expect(
        updatedData["2023-12-28"]["NIFTY-18000-2023-12-28"].callPrice
      ).toBe(105);
      expect(updatedData["2023-12-28"]["NIFTY-18000-2023-12-28"].putPrice).toBe(
        88
      );
    });

    const updatedData = optionChainSelector(store.getState()).data;

    const expectedUpdatedOptionChainData = {
      "2023-12-28": {
        "NIFTY-18000-2023-12-28": {
          id: "NIFTY-18000-2023-12-28",
          callPrice: 105,
          strike: 18000,
          putPrice: 88,
        },
        "NIFTY-18050-2023-12-28": {
          id: "NIFTY-18050-2023-12-28",
          callPrice: 95,
          strike: 18050,
          putPrice: 85,
        },
      },
    };

    expect(updatedData).toEqual(expectedUpdatedOptionChainData);

    mockServer.close();
  });
});
