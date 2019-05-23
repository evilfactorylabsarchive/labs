const app = require('express')()
const helmet = require('helmet')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const pino = require('express-pino-logger')

const { DISCORD_WEBHOOK_ID } = process.env

app.use(helmet())
app.use(pino())
app.use(bodyParser.json())

app.post('/', (req, res) => {
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

  fetch('https://discordapp.com/api/webhooks/' + DISCORD_WEBHOOK_ID, {
    method: 'POST',
    body: JSON.stringify({ content: template }),
    headers: {
      'Content-Type': 'application/json'
    }
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

module.exports = app
