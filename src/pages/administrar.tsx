import { Box, Button, Snackbar } from "@mui/material";
import Head from "next/head";
import ProtectedRoute from "~/lib/ProtectedRoute";
import AppBar from "~/lib/components/AppBar";
import { useUserRole } from "~/lib/util/useUserRole";

export default function Page() {

    const { isAdmin } = useUserRole()


    return <ProtectedRoute>
        <Head>
            <title>Biblioteca</title>
            <meta name="description" content="Biblioteca ETHF" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <AppBar

        />
        {isAdmin &&
            <div className="p-4 flex flex-col">
                <Button>
                    Eliminar todos los libros inactivos
                </Button>
                <Button>
                    Eliminar todos los libros perdidos
                </Button>
                <Button>
                    Eliminar todos los libros dañados
                </Button>
            </div>
        }

        {!isAdmin && <>
            No tenés permiso para acceder a esta página
        </>}



    </ProtectedRoute>
}