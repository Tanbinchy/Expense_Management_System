import React, { useCallback, useContext, useMemo, useState } from "react"
import axios from 'axios'


const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1")
    .replace(/\/+$/, "");
const BASE_URL = `${API_BASE_URL}/`;


const GlobalContext = React.createContext()

const getErrorMessage = (error) => {
    return error?.response?.data?.message || 'Something went wrong'
}

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    //calculate incomes
    const getIncomes = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`)
            setIncomes(response.data)
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }, [])

    const addIncome = useCallback(async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income)
            await getIncomes()
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }, [getIncomes])

    const deleteIncome = useCallback(async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`)
            await getIncomes()
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }, [getIncomes])

    const totalIncome = useCallback(() => {
        return incomes.reduce((total, income) => total + income.amount, 0)
    }, [incomes])


    //calculate incomes
    const getExpenses = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`)
            setExpenses(response.data)
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }, [])

    const addExpense = useCallback(async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense)
            await getExpenses()
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }, [getExpenses])

    const deleteExpense = useCallback(async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`)
            await getExpenses()
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }, [getExpenses])

    const totalExpenses = useCallback(() => {
        return expenses.reduce((total, expense) => total + expense.amount, 0)
    }, [expenses])


    const totalBalance = useCallback(() => {
        return totalIncome() - totalExpenses()
    }, [totalExpenses, totalIncome])

    const transactionHistory = useCallback(() => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }, [expenses, incomes])

    const contextValue = useMemo(() => ({
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError
    }), [
        addExpense,
        addIncome,
        deleteExpense,
        deleteIncome,
        error,
        expenses,
        getExpenses,
        getIncomes,
        incomes,
        totalBalance,
        totalExpenses,
        totalIncome,
        transactionHistory
    ])


    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}
