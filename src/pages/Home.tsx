import React, { useState, useEffect } from 'react'
import {
    List,
    ListItem,
    Center,
    Box,
    VStack,
    Text,
    StackDivider,
    Input,
    Button,
    Image,
    HStack,
} from '@chakra-ui/react'
import { saveAs } from 'file-saver'
import './Home.scss'
import { useRef } from 'react'

interface Todo {
    id: string
    text: string
}

export const TodoList = () => {
    const [text, setText] = useState('')
    const [sortType, setSortType] = useState('asc')
    const [todos, setTodos] = useState<Todo[]>([])
    const fileInput = useRef(null)

    useEffect(() => {
        const localStorageTodos = JSON.parse(localStorage.getItem('todos'))
        console.log(localStorageTodos)
        setTodos(localStorageTodos ? localStorageTodos : [])
    }, [])

    const handleAddTodo = (todo: Todo) => {
        if (todo.text.length > 0) {
            const trueTodos = [...todos, todo]
            localStorage.setItem('todos', JSON.stringify(trueTodos))
            setText('')
            setTodos(trueTodos)
        }
    }

    const handleRemoveTodo = (id: string) => {
        const filteredTodos = todos.filter((todo) => todo.id !== id)
        localStorage.setItem('todos', JSON.stringify(filteredTodos))
        setTodos(filteredTodos)
    }

    const sortTodos = () => {
        setSortType(sortType === 'asc' ? 'desc' : 'asc')
        switch (sortType) {
            case 'asc':
                const sortedTodos = todos.sort((a, b) =>
                    a.text > b.text ? 1 : -1
                )
                setTodos(sortedTodos)
                break
            case 'desc':
                const sortedTodosDesc = todos.sort((a, b) =>
                    a.text < b.text ? 1 : -1
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
            const todos = []
            for (let line of lines) {
                const [id, text] = line.split(': ')
                todos.push({ id, text })
            }
            setTodos(todos)
            localStorage.setItem('todos', JSON.stringify(todos))
        }
    }
    return (
        <VStack
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="center"
            paddingTop="15px"
        >
            <Text fontSize="2xl">Todo List</Text>

            <Image
                onClick={sortTodos}
                src={
                    sortType === 'asc'
                        ? '/src/img/sort_asc.svg'
                        : '/src/img/sort_desc.svg'
                }
                width="50px"
                cursor="pointer"
            />

            <List spacing="5px">
                {todos.length > 0 ? (
                    todos.map((todo) => {
                        return (
                            <ListItem
                                // style={{ display: 'flex', flexDirection: 'column' }}
                                key={todo.id}
                            >
                                {todo.text}
                                <Button
                                    size="xs"
                                    marginLeft="16px"
                                    colorScheme="red"
                                    onClick={() => handleRemoveTodo(todo.id)}
                                >
                                    Удалить
                                </Button>
                            </ListItem>
                        )
                    })
                ) : (
                    <Center>Нету заметок</Center>
                )}
            </List>
            <form
                onSubmit={(e) => {
                    e.preventDefault()

                    if (text.length <= 40) {
                        handleAddTodo({
                            id: Date.now().toString(),
                            text: text,
                        })
                    }
                }}
            >
                <VStack align="center">
                    <Input
                        type="text"
                        size="md"
                        placeholder="Добавить задачу"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <HStack>
                        <Button colorScheme="blue" type="submit">
                            Добавить
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
                    </HStack>
                </VStack>
            </form>
        </VStack>
    )
}
