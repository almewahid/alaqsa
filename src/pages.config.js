import Home from './pages/Home';
import Teachers from './pages/Teachers';
import TeacherDetails from './pages/TeacherDetails';
import MyBookings from './pages/MyBookings';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Teachers": Teachers,
    "TeacherDetails": TeacherDetails,
    "MyBookings": MyBookings,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};