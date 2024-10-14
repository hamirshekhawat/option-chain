State structure

```json
{
    optionChain: {
        ids: ["$underlying-$strike-$expiry"],
        chain: {
            "$underlying-$strike-$expiry" : {
                id: string, // "$underlying-$strike-$expiry"
                callPrice: number,
                strike: number,
                putPrice: number, 
            },
            ...
        }
    }
}
```

TODO:
1. add query slices for contract, option chain and websocket
2. add state slices for contract, expiry and options