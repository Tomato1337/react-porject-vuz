import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TodoList } from './Home.tsx'
import { Page404 } from './Page404'

export const Pages = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TodoList />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </BrowserRouter>
    )
}
