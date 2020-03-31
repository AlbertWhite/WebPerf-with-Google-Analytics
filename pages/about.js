import Layout from '../components/MyLayout.js'


export default function About() {
  const array = new Array(10000).fill()
  return (
    <Layout>
      {/* // render 1000 times to make the rendering longer */}
      {array.map(() => (<p>This is the about page</p>))}
    </Layout>
  )
}
