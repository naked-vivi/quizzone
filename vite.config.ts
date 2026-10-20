import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import generateQuizApi from './api/generate-quiz'

function localQuizApi(): Plugin {
  return {
    name: 'quizzone-local-api',
    configureServer(server) {
      server.middlewares.use('/api/generate-quiz', async (request, response, next) => {
        try {
          const chunks: Buffer[] = []
          for await (const chunk of request) chunks.push(Buffer.from(chunk))

          const headers = new Headers()
          for (const [name, value] of Object.entries(request.headers)) {
            if (Array.isArray(value)) value.forEach((item) => headers.append(name, item))
            else if (value !== undefined) headers.set(name, value)
          }

          const body = Buffer.concat(chunks)
          const apiRequest = new Request('http://localhost/api/generate-quiz', {
            method: request.method,
            headers,
            body: body.length ? new Uint8Array(body) : undefined,
          })
          const apiResponse = await generateQuizApi.fetch(apiRequest)

          response.statusCode = apiResponse.status
          apiResponse.headers.forEach((value, name) => response.setHeader(name, value))
          response.end(Buffer.from(await apiResponse.arrayBuffer()))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY
  if (env.GROQ_MODEL) process.env.GROQ_MODEL = env.GROQ_MODEL

  return {
    plugins: [react(), localQuizApi()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 4000,
      open: true,
    },
  }
})
