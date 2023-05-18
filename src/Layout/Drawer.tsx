import {styled} from '@mui/system';
import MuiDrawer, {DrawerProps} from '@mui/material/Drawer';
import {Theme} from '@mui/material/styles';

interface CustomDrawerProps extends DrawerProps {
  width?: number;
}

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })<CustomDrawerProps>(
  ({ theme, open, width }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: width || 240,
      transition: (theme.transitions as Theme['transitions']).create('width', {
        easing: (theme.transitions as Theme['transitions']).easing.sharp,
        duration: (theme.transitions as Theme['transitions']).duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: (theme.transitions as Theme['transitions']).create('width', {
          easing: (theme.transitions as Theme['transitions']).easing.sharp,
          duration: (theme.transitions as Theme['transitions']).duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  })
);

export default Drawer;
