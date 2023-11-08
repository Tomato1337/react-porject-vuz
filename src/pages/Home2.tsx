//
import React, { useEffect, useState } from 'react'
import {
    chakra,
    Button,
    List,
    ListItem,
    Heading,
    Flex,
    Input,
    Text,
    Image,
} from '@chakra-ui/react'
import { saveAs } from 'file-saver'
import { useRef } from 'react'
import { v4 as uuid } from 'uuid'

export const Home = () => {
    const [todos, setTodos] = useState([])
    const [text, setText] = useState('')
    const [sortType, setSortType] = useState('asc')
    const fileInput = useRef(null)

    useEffect(() => {
        const localStorageTodos = JSON.parse(localStorage.getItem('todos'))
        console.log(localStorageTodos)
        sortTodos(localStorageTodos ? localStorageTodos : [], sortType)
    }, [])

    const createTodoHandler = (text) => {
        const newTodosState = [...todos, { id: uuid(), text }]
        localStorage.setItem('todos', JSON.stringify(newTodosState))
        sortTodos(newTodosState, sortType)
        setText('')
        // a = [1,2,3] => b = [...[1,2,3], 4,5,6] = [1,2,3,4,5,6]
    }

    const removeTodoHandler = (id) => {
        const newTodosState = todos.filter((todo) => todo.id !== id)
        localStorage.setItem('todos', JSON.stringify(newTodosState))
        sortTodos(newTodosState, sortType)
    }

    const sortTodos = (target, type) => {
        switch (type) {
            case 'asc':
                const sortedTodos = target.sort(
                    (a, b) => (a.text > b.text ? 1 : -1)
                    // a > b => 1 Меняем местами
                    // a < b => -1 Не меняем местами
                )
                setTodos(sortedTodos)
                break
            case 'desc':
                const sortedTodosDesc = target.sort(
                    (a, b) => (a.text > b.text ? -1 : 1)
                    // a > b => -1 Не меняем местами
                    // a < b => 1 Меняем местами
                )
                setTodos(sortedTodosDesc)
                break
        }
    }

    const exportTodos = () => {
        const todoText = todos
            .map((todo) => `${todo.id}: ${todo.text}`)
            .join('\n')

        const blob = new Blob([todoText], { type: 'text/plain;charset=utf-8' })

        saveAs(blob, 'todos.txt')
    }

    const importTodos = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = (e) => {
            const lines = e.target.result.split('\n')
            console.log(lines)
            const todos = lines.map((line) => {
                const [id, text] = line.split(': ')
                return { id, text }
            })
            setTodos(todos)
            localStorage.setItem('todos', JSON.stringify(todos))
        }
    }

    const changeSortType = () => {
        const newSortType = sortType === 'asc' ? 'desc' : 'asc'
        sortTodos(todos, newSortType)
        setSortType(newSortType)
    }

    return (
        <Flex
            flexDirection="column"
            h="100vh"
            w="97vw"
            marginTop="1rem"
            marginBottom="1rem"
            gap="1rem"
            alignItems="center"
            maxW="100%"
        >
            <Heading textTransform="uppercase">Todo List</Heading>
            <Image
                onClick={changeSortType}
                src={
                    sortType === 'asc'
                        ? '/src/img/sort_asc.svg'
                        : '/src/img/sort_desc.svg'
                }
                width="50px"
                cursor="pointer"
            />
            <List
                h="60vh"
                w="70vw"
                display="flex"
                flexDirection="column"
                overflowY="scroll"
                border="2px solid black"
                borderRadius="md"
                p="10px"
            >
                {todos.map((todo) => (
                    <ListItem
                        key={todo.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom="1px solid gray"
                        py="8px"
                    >
                        <Text>{todo.text}</Text>
                        <Button
                            onClick={() => removeTodoHandler(todo.id)}
                            background="red.500"
                            color="white"
                            _hover={{
                                background: 'red.600',
                            }}
                        >
                            Удалить
                        </Button>
                    </ListItem>
                ))}
            </List>
            <chakra.form
                onSubmit={(e) => {
                    e.preventDefault() // Без перезагрузки приложения после добавления задачи
                    createTodoHandler(text)
                }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="20px"
            >
                <Input
                    placeholder="Напишите задачу..."
                    maxLength={80}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxW="300px"
                    h="32px"
                />
                <Button
                    isDisabled={!text.trim().length}
                    type="submit"
                    w="fit-content"
                    background="blue.500"
                    color="white"
                    _hover={{
                        background: 'blue.600',
                    }}
                >
                    Добавить задачу
                </Button>
                <Button onClick={exportTodos} colorScheme="orange">
                    Экспортировать
                </Button>
                <input
                    type="file"
                    ref={fileInput}
                    onChange={importTodos}
                    style={{ display: 'none' }}
                />
                <Button
                    onClick={() => fileInput.current.click()}
                    colorScheme="green"
                >
                    Импортировать
                </Button>
            </chakra.form>
        </Flex>
    )
}
