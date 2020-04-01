import Header from './Header'
import { initGA, logPageView, logTiming } from '../utils/analytics'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

export default class Layout extends React.Component {
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
    logTiming('category_test_with_now', 'variable_test_with_now', window.performance.now())
  }
  render() {
    return (
      <div style={layoutStyle}>
        <Header />
        {this.props.children}
      </div>
    )
  }
}

