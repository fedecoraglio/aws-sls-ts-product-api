export default {
  type: 'object',
  properties: {
    name: { type: 'string' },
    summary: { type: 'string' },
    content: { type: 'string' },
  },
  required: ['name'],
} as const;
