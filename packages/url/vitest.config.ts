import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    // reporters: ['default', 'verbose', 'json', 'html'],
    // outputFile: {
    //   html: './reports/index.html',
    //   json: './reports/json-report.json',
    // },
    // coverage: {
    //   provider: 'v8', // 'istanbul' or 'v8'
    //   // reporter: ['text', 'json', 'html'],
    //   reportsDirectory: './coverage',
    // },
  },
})
