import Layout from '../components/MyLayout.js'
import { trackEvent } from '../utils/analytics'

export default function About() {
  return (
    <Layout>
      <h3>
        Click on the button to buy the batman videos:
      </h3>
      <button onClick={() => {
        const action = 'timing_complete'
        const name = 'test_name'
        const value = 1000000 // tet value 1000
        const event_category = 'test_event_category'
        trackEvent({
          action, name, value, event_category
        })
      }}>
        Buy
      </button>
    </Layout>
  )
}
