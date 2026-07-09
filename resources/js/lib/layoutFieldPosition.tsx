const insertAfterField = (
  fields: any[],
  targetName: string,
  insertFields: any[],
) => {
  const index = fields.findIndex((f) => f.name === targetName);
  if (index === -1) return fields;

  return [
    ...fields.slice(0, index + 1),
    ...insertFields,
    ...fields.slice(index + 1),
  ];
};

export default insertAfterField;
