import About from '../Components/Statics/About';
import Home from '../Components/Statics/Home';
import Animations from '../Components/Statics/Animations';
import Eula from '../Components/Statics/Eula';
import Admin from '../Components/Statics/Admin';
import NotFound from '../Components/Statics/NotFound';

const pages = [
  { 
    id: 'default', displayName: 'Home',
    path: '/', componentRef: Home, 
    inMenu: true, icon: 'home' 
  },
  { 
    id: 'home', displayName: 'Home',
    path: '/home',  componentRef: Home, 
    inMenu: false 
  },
  { 
    id: 'animations', displayName: 'Animations', 
    path: '/animations', componentRef: Animations, 
    inMenu: true, icon: 'desktop' 
  },
  // { id: 'gallery ', displayName: 'Gallery ',
  //   path: '/gallery', componentRef: Gallery, 
  //   inMenu: true, icon: 'camera-o' 
  // },
  { 
    id: 'about', displayName: 'About', 
    path: '/about', componentRef: About, 
    inMenu: true, icon: 'info-circle-o' 
  },
  { 
    id: 'eula', displayName: 'EULA', 
    path: '/eula', componentRef: Eula, 
    inMenu: true, icon: 'profile' 
  },

  { 
    id: 'admin', name: 'admin', 
    path: '/admin', componentRef: Admin, 
    inMenu: false,
  },

  // keep last
  { 
    id: 'notFound', name: '404', 
    path: '*', componentRef: NotFound, 
    inMenu: false
  },
]

export default pages;