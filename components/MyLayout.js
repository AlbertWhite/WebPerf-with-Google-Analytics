import Header from './Header'
import { trackPageview } from '../utils/analytics'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

export default class Layout extends React.Component {
  render() {
    return (
      <div style={layoutStyle}>
        <Header />
        {this.props.children}
      </div>
    )
  }
}

