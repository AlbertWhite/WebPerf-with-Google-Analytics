import Header from './Header'
import { trackPageview } from '../utils/analytics'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

export default class Layout extends React.Component {
  componentDidMount() {
    trackPageview()
    // logTiming('category_test_with_now', 'variable_test_with_now', Math.round(window.performance.now()))
    //logTiming('category_test_with_now', 'variable_test_with_now', 10000000000000000)//test
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

