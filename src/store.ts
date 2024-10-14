import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { api } from './services/api.slice'
import { contractReducer } from './features/contracts/contract.slice'

export const createStore = (
) =>
    configureStore({
        reducer: {
            contract: contractReducer,
            [api.reducerPath]: api.reducer,

        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(api.middleware),

    })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
