export default {
  type: 'object',
  properties: {
    categoryIds: { type: 'string[]' },
  },
  required: ['categoryIds'],
} as const;
