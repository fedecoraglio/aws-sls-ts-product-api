export default {
  type: 'object',
  properties: {
    productName: { type: 'string' },
  },
  required: ['productName'],
} as const;
