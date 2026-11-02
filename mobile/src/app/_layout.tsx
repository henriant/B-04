// legger til layout.tsx som root layout for appen, slik at alle sider i appen får samme layout. Dette gjør det enklere å endre layouten på tvers av appen.

import Layout from "@/components/pageComponents/Layout";

export default function RootLayout() {
    return <Layout />;
}