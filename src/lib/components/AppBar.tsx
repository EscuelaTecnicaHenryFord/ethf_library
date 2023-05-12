import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react'
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { stringAvatar } from '../util/nameUtils';

export default function AppBar() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const { data: session } = useSession();

    return (
        <React.Fragment>
            <Drawer
                anchor='left'
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box
                    sx={{ width: 300, maxWidth: '100%' }}
                    role="presentation"
                    onClick={() => setOpen(false)}
                    onKeyDown={() => setOpen(false)}
                >
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={session?.user.name}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {session?.user.email}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
    
                    </List>
                    <Divider />
                    <List>
                        <ListItem disablePadding onClick={() => void router.push('/')}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Inicio"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding onClick={() => void router.push('/comunicaciones')}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <ListAltIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Libros"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding onClick={() => void router.push('/nueva-comunicacion')}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Agregar libro"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem disablePadding onClick={() => void signOut()}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <ExitToAppIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Cerrar sesión"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ flexGrow: 1, zIndex: 2 }}>
                <MuiAppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            onClick={() => setOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            Comunicaciones
                        </Typography>
                        <Avatar {...stringAvatar(session?.user.name || 'H F')} />
                        {/* <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="signout"
                            sx={{ mr: 2 }}
                            onClick={() => void signOut()}
                        >
                            <ExitToAppIcon />
                        </IconButton> */}
                        {/* <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Buscar..."
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search> */}
                    </Toolbar>
                </MuiAppBar>
            </Box>
        </React.Fragment>
    );
}