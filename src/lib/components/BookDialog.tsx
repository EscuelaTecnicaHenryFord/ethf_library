import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { Book } from '@prisma/client';
import { TextField } from '@mui/material';
import { api } from '~/utils/api';

interface Props {
    open: boolean
    handleClose: () => unknown
    book?: Book
    onCompleted?: () => unknown
}

export default function BookDialog({ open, handleClose, book, onCompleted }: Props) {

    const { mutateAsync: addBook } = api.addBook.useMutation()
    const { mutateAsync: updateBook } = api.updateBook.useMutation()
    const { mutateAsync: deleteBook } = api.deleteBook.useMutation()

    const [code, setCode] = React.useState(book?.code || 0)
    const [title, setTitle] = React.useState(book?.title || '')
    const [author, setAuthor] = React.useState(book?.author || '')
    const [genre, setGenre] = React.useState(book?.genre || '')
    const [editor, setEditor] = React.useState(book?.editor || '')
    const [location, setLocation] = React.useState(book?.location || '')

    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const isValid = Number.isInteger(code) && code > 0 && title.length > 0

    function handleDelete() {
        if (!book) return

        if(!confirm('¿Estás seguro de que quieres eliminar este libro?')) return

        setLoading(true)
        void deleteBook({
            id: book.id,
        }).then(() => {
            handleClose()
            onCompleted?.()
        }).catch(e => {
            const err = e as { code?: string, message?: string }
            setError(err.message || '')
            setLoading(false)
        })
    }

    return (
        <Dialog
            open={open}
            onClose={() => {
                if (!loading) handleClose()
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form action="" onSubmit={e => {
                e.preventDefault()


                setError('')
                setLoading(true)

                if (book) {
                    void updateBook({
                        id: book.id,
                        code,
                        title,
                        author,
                        genre,
                        editor,
                        location
                    }).then(() => {
                        handleClose()
                        onCompleted?.()
                    }).catch(e => {
                        const err = e as { code?: string, message?: string }
                        if (err.message === 'CONFLICT') {
                            setError('El código ya se usó para otro libro')
                        } else {
                            setError(err.message || '')
                        }
                        setLoading(false)
                    })
                } else {
                    void addBook({
                        code,
                        title,
                        author,
                        genre,
                        editor,
                        location
                    }).then(() => {
                        handleClose()
                        onCompleted?.()
                    }).catch(e => {
                        const err = e as { code?: string, message?: string }
                        if (err.message === 'CONFLICT') {
                            setError('El código ya se usó para otro libro')
                        } else {
                            setError(err.message || '')
                        }
                        setLoading(false)
                    })
                }
            }}>
                <DialogTitle id="alert-dialog-title">
                    {book ? 'Modificar libro' : 'Añadir libro'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {book ? 'Modifica los datos del libro' : 'Añade los datos del libro'}
                    </DialogContentText>
                    {error && <DialogContentText id="alert-dialog-error" color="error">
                        {error}
                    </DialogContentText>}
                    <TextField
                        autoFocus={!book}
                        margin="dense"
                        id="code"
                        label="Código"
                        type="number"
                        fullWidth
                        variant="standard"
                        onChange={e => setCode(parseInt(e.target.value))}
                        value={code ? code : ''}
                    />
                    <TextField
                        margin="dense"
                        id="title"
                        label="Título"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setTitle(e.target.value)}
                        value={title}
                    />
                    <TextField
                        margin="dense"
                        id="author"
                        label="Autor/a"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setAuthor(e.target.value)}
                        value={author}
                    />
                    <TextField
                        margin="dense"
                        id="genre"
                        label="Género"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setGenre(e.target.value)}
                        value={genre}
                    />
                    <TextField
                        margin="dense"
                        id="editor"
                        label="Editorial"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setEditor(e.target.value)}
                        value={editor}
                    />
                    <TextField
                        margin="dense"
                        id="location"
                        label="Ubicación"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setLocation(e.target.value)}
                        value={location}
                    />
                </DialogContent>
                <DialogActions>
                    {book && <Button type="button" color="error" onClick={handleDelete} disabled={loading}>Eliminar libro</Button>}
                    <Button type="reset" onClick={handleClose} disabled={loading}>Cancelar</Button>
                    <Button type='submit' autoFocus={!!book} disabled={!isValid || loading}>
                        {book ? 'Modificar' : 'Añadir'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}