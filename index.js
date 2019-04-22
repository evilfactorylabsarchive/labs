const app = require('express')()
const fetch = require('node-fetch')
const bodyParser = require('body-parser')

// Monkey patch 🤟  https://github.com/ccxt/ccxt/issues/3751#issuecomment-465642911
require('tls').DEFAULT_ECDH_CURVE = 'auto'

const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/join', (req, res) => {
  const { name, role, github, email, portfolios, notes } = req.body
  const template = `
  Someone want to join!

  Name: ${name}
  Email: ${email}
  Role: ${role}
  Github: ${github}
  Portfolios: ${portfolios.join(', ')}

  Notes: ${notes}
`
  fetch('https://pushmore.io/webhook/' + process.env.PUSHMORE_WEBHOOK_ID, {
    method: 'POST',
    body: template
  })
    .then(res => res.text())
    .then(() => res.send({ thanks: 'We will getting in touch with you soon' }))
    .catch(err => {
      console.error(err)
      res.send({ error: err })
    })
})

app.get('/', (_, res) => {
  res.send({ checkThis: 'https://evilfactory.id/join/' })
})

app.listen(PORT)
