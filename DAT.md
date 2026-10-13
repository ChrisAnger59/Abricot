front-end/

├── app/
    ├── layout.tsx              ----> = index.html with Vite (html/head/body tags) + import of globals.css + upload of fonts and metadata
    ├── globals.css             ----> global StyleSheet
    ├── page.tsx                ----> Redirect "/" to "/dashboard" or "/login"
    ├── (auth)/                 ----> No Header/Footer pages
        ├── layout.tsx          ----> auth pages Layout (2 cols: 1 form + 1 img)
        ├── login/              
            ├── page.tsx        ----> Login Page
        ├── register/
            ├── page.tsx        ----> Register Page
    ├── (main)/                 ----> Authenticated pages
        ├── layout.tsx          ----> main pages Layout (Header / Content / Footer)
        ├── dashboard/          
            ├── page.tsx        ----> Dashboard Page
        ├── projects/
            ├── page.tsx        ----> All Projects page
            ├── [id]/page.tsx   ----> Project[id] details 
        ├── account/
            ├── page.tsx        ----> Account page
├── components/                 ----> Reusable components
    ├── Atoms/                  ----> Buttons / Inputs / Logo / Label
    ├── Molecules/              ----> Cards
    ├── Organisms/              ----> Forms / Header / Footer / Banner
    ├── Modales/                ----> AddTasks / AddTasks IA / TaskList IA / ModifyTask / CreateProject / ModifyProject
├── lib/                        ----> Utils functions / API calls (login / collects projects / etc)
├── types/                      ----> TypeScript types