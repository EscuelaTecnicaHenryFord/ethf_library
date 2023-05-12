import { type NextPage } from "next";
import Head from "next/head";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { api } from "~/utils/api";
import { useState } from "react";
import AppBar from "~/lib/components/AppBar";
import ProtectedRoute from "~/lib/ProtectedRoute";

const Home: NextPage = () => {
  const { data: books } = api.getBooks.useQuery()

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<{ [key: string]: boolean }>({ id: false })

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  const [, setSelection] = useState<string[]>([])

  return (
    <ProtectedRoute>
      <Head>
        <title>Biblioteca</title>
        <meta name="description" content="Biblioteca ETHF" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar />
      <Box
        sx={{
          position: 'fixed',
          top: 60,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <DataGrid
          sx={{ border: 'none' }}

          rows={books || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={setColumnVisibilityModel}
          pageSizeOptions={[5]}
          onRowSelectionModelChange={s => setSelection(s.map(s => s.toString()))}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </ProtectedRoute>
  );
};

export default Home;




const columns: GridColDef[] = [
  {
    field: 'code',
    headerName: 'Code',
    width: 90,
  },
  {
    field: 'title',
    headerName: 'Título',
    width: 360,
  },
  {
    field: 'author',
    headerName: 'Autor/a',
    width: 280,
  },
  {
    field: 'genre',
    headerName: 'Género',
    width: 190,
  },
  {
    field: 'editor',
    headerName: 'Editorial',
    width: 260,
  },
  { field: 'id', headerName: 'ID', width: 90 },
];