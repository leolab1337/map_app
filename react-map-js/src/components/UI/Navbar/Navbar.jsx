import { AppBar, Toolbar, Typography} from '@material-ui/core';
import { Link } from 'react-router-dom'

import useStyles from './styles'


const Navbar = () => {

    const classes = useStyles();


    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <Typography variant="h5" className={classes.title}>
                    Map App
                </Typography>

                <Typography variant="h5" className={classes.navMenu}>
                    <span> <Link className={classes.navItem} to="/registration">Registration</Link></span>
                    <span> <Link className={classes.navItem} to="/">Map</Link></span>
                    <span><Link className={classes.navItem} to="/about">About</Link></span>
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;