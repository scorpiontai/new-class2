import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/components/loginRegister/LoginPage.vue';
import SignupForm from '@/components/loginRegister/SignupPage.vue';
import DashboardPage from '@/components/DashboardPage.vue'
import MakeClass from '@/components/MakeClass.vue'
import DashboardTeacherPage from '@/components/Dashboard/DashboardTeacherPage.vue'
import TambahTask from '@/components/Management/TambahTask.vue'
import StreamingPage from '@/components/StreamingPage.vue'
import StreamingTeacher from '@/components/StreamingTeacher.vue'
import ListTugas from '@/components/ListTugas.vue'
import DashboardStudentPage from '@/components/Dashboard/DashboardStudent.vue'
import JoinClass from '@/components/JoinClass.vue'
import SettingStudent from '@/components/SettingStudent.vue'
import TambahMateri from '@/components/Management/TambahMateri.vue'
import ProfilePage from '@/components/Profile/ProfilePage.vue'
const routes = [
    {
        path: '/',
        name: 'Home',
        component: SignupForm,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginForm,
    },
    {
        path: '/signup',
        name: 'Signup',
        component: SignupForm,
    },
    {
        path: "/dashboard",
        name: "DashboardPage",
        component: DashboardPage,
    },
    {
        path: "/make/class",
        name: "MakeClass",
        component: MakeClass
    },
    {
        path: "/dashboard/teacher",
        name: "DashboardTeacherPage",
        component: DashboardTeacherPage
    },
    {
        path: "/dashboard/student",
        name: "DashboardStudentPage",
        component: DashboardStudentPage
    },
    {
        path: "/make/task",
        name: "TambahTugas",
        component: TambahTask
    },
    {
        path: "/make/stream",
        name: "StreamingPage",
        component: StreamingPage
    },
    {
        path: "/list/stream",
        name: "StreamingTeacher",
        component: StreamingTeacher
    },
    {
        path: "/list/matery/:classCode",
        name: "ListTugas",
        component: ListTugas
    },
    {
        path: "/dashboard/student/join",
        name: "JoinClass",
        component: JoinClass
    },
    {
        path: "/list/task/settings",
        name: "SettingStudent",
        component: SettingStudent
    },
    {
        path: "/make/matery/:classCode",
        name: "TambahMateri",
        component: TambahMateri,
        props: true
    },
    {
        path: "/Profile/:name",
        name: "ProfilePage",
        component: ProfilePage
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
