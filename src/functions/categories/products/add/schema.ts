export default {
  type: 'object',
  properties: {
    productIds: { type: 'string[]' },
  },
  required: ['productIds'],
} as const;
