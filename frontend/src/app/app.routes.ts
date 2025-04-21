import { Routes } from "@angular/router";
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "login",
        loadComponent: () => import("./modules/auth/pages/login/login.component").then((m) => m.LoginComponent)
    },
    {
        path: "todos",
        loadComponent: () => import("./modules/todo/pages/todo-dashboard/todo-dashboard.component").then((m) => m.TodoDashboardPageComponent),
        canActivate: [AuthGuard]
    },
];
