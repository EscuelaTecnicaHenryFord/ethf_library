import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { Book } from '@prisma/client';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { RouterInputs, api } from '~/utils/api';
import { useUserRole } from '../util/useUserRole';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CheckIcon from '@mui/icons-material/Check';
import HelpIcon from '@mui/icons-material/Help';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

interface Props {
    open: boolean
    handleClose: () => unknown
    book?: Book
    onCompleted?: (props: { deleted?: string, added?: string, updated?: string }) => unknown
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
    const [reference, setReference] = React.useState(book?.reference || '')
    const [currentlyWith, setCurrentlyWith] = React.useState(book?.currentlyWith || '')
    const [status, setStatus] = React.useState(book?.status || 'active')

    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const isValid = Number.isInteger(code) && code > 0 && title.length > 0

    const { isAdmin } = useUserRole()

    function handleDelete() {
        if (!book) return

        if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) return

        setLoading(true)
        void deleteBook({
            id: book.id,
        }).then(() => {
            handleClose()
            onCompleted?.({ deleted: title })
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
                        location,
                        reference,
                        currentlyWith,
                        status: status as RouterInputs['updateBook']['status'],
                    }).then(() => {
                        handleClose()
                        onCompleted?.({ updated: title })
                        handleClose()
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
                        location,
                        reference,
                        currentlyWith,
                        status: status as RouterInputs['updateBook']['status'],
                    }).then(() => {
                        handleClose()
                        onCompleted?.({ added: title })
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
                    {book ? (isAdmin ? 'Modificar libro' : 'Detalles') : 'Añadir libro'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {book ? (isAdmin ? 'Modifica los datos del libro' : '') : 'Añade los datos del libro'}
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
                        onChange={e => isAdmin ? setCode(parseInt(e.target.value)) : undefined}
                        value={code ? code : ''}
                    />
                    <TextField
                        margin="dense"
                        id="title"
                        label="Título"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => isAdmin ? setTitle(e.target.value) : undefined}
                        value={title}
                    />
                    <TextField
                        margin="dense"
                        id="author"
                        label="Autor/a"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => isAdmin ? setAuthor(e.target.value) : undefined}
                        value={author}
                    />
                    <TextField
                        margin="dense"
                        id="genre"
                        label="Género"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => isAdmin ? setGenre(e.target.value) : undefined}
                        value={genre}
                    />
                    <TextField
                        margin="dense"
                        id="editor"
                        label="Editorial"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => isAdmin ? setEditor(e.target.value) : undefined}
                        value={editor}
                    />
                    <TextField
                        margin="dense"
                        id="location"
                        label="Ubicación"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => isAdmin ? setLocation(e.target.value) : undefined}
                        value={location}
                    />
                    <TextField
                        margin="dense"
                        id="reference"
                        label="Refrencia"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => isAdmin ? setReference(e.target.value) : undefined}
                        value={reference}
                    />
                    <TextField
                        margin="dense"
                        id="currentlyWith"
                        label="Usuario actualmente con el libro"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => isAdmin ? setCurrentlyWith(e.target.value) : undefined}
                        value={currentlyWith}
                    />
                    <FormControl fullWidth className='mt-4'>
                        <InputLabel id="book-status">Estado</InputLabel>
                        <Select
                            fullWidth
                            labelId='book-status'
                            value={status}
                            label="Estado"
                            onChange={e => isAdmin ? setStatus(e.target.value as string) : undefined}
                        >
                            <MenuItem value={'inactive'}>
                                <div className='flex items-center gap-2'>
                                    <DoNotDisturbOnIcon fontSize={'small'} />
                                    Inactivo
                                </div>
                            </MenuItem>
                            <MenuItem value={'active'} className='flex items-center gap-2'>
                                <div className='flex items-center gap-2'>
                                    <CheckIcon fontSize={'small'} />
                                    Activo
                                </div>
                            </MenuItem>
                            <MenuItem value={'lost'} className='flex items-center gap-2'>
                                <div className='flex items-center gap-2'>
                                    <HelpIcon fontSize={'small'} />
                                    Perdido
                                </div>
                            </MenuItem>
                            <MenuItem value={'damaged'} className='flex items-center gap-2'>
                                <div className='flex items-center gap-2'>
                                    <BrokenImageIcon fontSize={'small'} />
                                    Dañado
                                </div>
                            </MenuItem>
                        </Select>
                    </ FormControl>
                </DialogContent>
                <DialogActions>
                    {(book && isAdmin) && <Button type="button" color="error" onClick={handleDelete} disabled={loading}>Eliminar libro</Button>}
                    <Button type="reset" onClick={handleClose} disabled={loading}>Cancelar</Button>
                    {isAdmin && <>
                        <Button type='submit' autoFocus={!!book} disabled={!isValid || loading} variant='outlined'>
                            {book ? 'Guardar' : 'Añadir'}
                        </Button>
                    </>}
                </DialogActions>
            </form>
        </Dialog>
    );
}