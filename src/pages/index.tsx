import { type NextPage } from "next";
import Head from "next/head";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { api } from "~/utils/api";
import { useMemo, useState } from "react";
import AppBar from "~/lib/components/AppBar";
import ProtectedRoute from "~/lib/ProtectedRoute";
import BookDialog from "~/lib/components/BookDialog";
import { Button, Snackbar } from "@mui/material";
import { useUserRole } from "~/lib/util/useUserRole";
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CheckIcon from '@mui/icons-material/Check';
import HelpIcon from '@mui/icons-material/Help';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

const Home: NextPage = () => {
  const { data: books, refetch } = api.getBooks.useQuery()

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<{ [key: string]: boolean }>({ id: false })

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  const [selection, setSelection] = useState<string[]>([])

  const [search, setSearch] = useState('')

  const [dialogState, setDialogState] = useState<{ show: boolean, bookId: string | null }>({ show: false, bookId: null })

  const { isAdmin } = useUserRole()

  const [modalKey, setModalKey] = useState(0)

  function resetModal() {
    setModalKey(modalKey + 1);
  }

  const editingBook = useMemo(() => {
    return books?.find(b => b.id.toString() === dialogState.bookId)
  }, [books, dialogState.bookId])

  const filteredBooks = useMemo(() => {
    return books?.filter(b => {
      const code = b.code.toString()
      const title = b.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      const author = b.author.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      const genre = b.genre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      const editor = b.editor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      const location = b.location.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      const reference = b.reference.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      const currentlyWith = b.currentlyWith.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

      const filter = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

      return code.includes(filter) || title.includes(filter) || author.includes(filter) || genre.includes(filter) || editor.includes(filter) || location.includes(filter) || reference.includes(filter) || currentlyWith.includes(filter)
    })
  }, [books, search])

  function openAddBookDialog() {
    setDialogState({ show: true, bookId: null })
  }

  const [openSnackbar, setOpenSnackbar] = useState('');


  return (
    <ProtectedRoute>
      <Head>
        <title>Biblioteca</title>
        <meta name="description" content="Biblioteca ETHF" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Snackbar open={!!openSnackbar} onClose={() => setOpenSnackbar('')} message={openSnackbar} autoHideDuration={6000} />
      <div className="absolute bottom-2 left-3 z-10 flex gap-2 bg-white">
        {isAdmin && <Button onClick={() => setDialogState({ show: true, bookId: null })}>Añadir libro</Button>}
        {(selection.length === 1) && <Button onClick={() => setDialogState({ show: true, bookId: selection[0] || null })}>{isAdmin ? 'Modificar seleccionado' : 'Ver seleccionado'}</Button>}
      </div>
      <AppBar
        onSearch={setSearch}
        onClickAddBook={openAddBookDialog}
      />
      <BookDialog
        key={dialogState.bookId || modalKey}
        open={dialogState.show}
        handleClose={() => setDialogState({ show: false, bookId: null })}
        onCompleted={(data) => {
          void refetch()
          resetModal()
          if (data.added) {
            setOpenSnackbar("Se agregó el libro " + data.added);
          } else if (data.updated) {
            setOpenSnackbar("Se actualizó el libro " + data.updated);
          } else if (data.deleted) {
            setOpenSnackbar("Se eliminó el libro " + data.deleted);
          }
          setDialogState({ show: true, bookId: null })
        }}
        book={editingBook}
      />
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

          rows={filteredBooks || []}
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
          onCellDoubleClick={(params) => {
            if (params.value === true || params.value === false) return
            setDialogState({ show: true, bookId: params.id.toString() })
          }}
          pageSizeOptions={[100]}
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
    field: 'status',
    headerName: 'Estado',
    width: 60,
    renderCell: (params) => {
      if (params.value === 'active') {
        return <CheckIcon fontSize={'small'} />
      }

      if (params.value === 'lost') {
        return <HelpIcon fontSize={'small'} />
      }

      if (params.value === 'damaged') {
        return <BrokenImageIcon fontSize={'small'} />
      }

      if (params.value === 'inactive') {
        return <DoNotDisturbOnIcon fontSize={'small'} />
      }

      return '--'
    }
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
  {
    field: 'location',
    headerName: 'Ubicación',
    width: 220,
  },
  {
    field: 'currentlyWith',
    headerName: 'Usuario actualmente con el libro',
    width: 220,
  },
  {
    field: 'reference',
    headerName: 'Referencia',
    width: 260,
  },
  { field: 'id', headerName: 'ID', width: 90 },
];