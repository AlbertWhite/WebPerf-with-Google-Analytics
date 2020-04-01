import App from 'next/app'
import Router from 'next/router'

import { trackPageview } from '../utils/analytics'

Router.events.on('routeChangeComplete', url => trackPageview(url))

export default App