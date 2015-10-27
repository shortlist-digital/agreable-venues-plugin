const parseColumns = [
  'name',
  'address',
  'brand',
  'ephemeral',
  'opening_date',
  'closing_date',
  'facebook',
  'instagram',
  'twitter',
  'website',
  'images',
  'location',
  'phone_number',
  'price',
  'review',
  'sell',
  'slug',
  'tags',
  'venue_type'
];

function returnSimpleObject(parseObject){
  const obj = { }
  parseColumns.forEach(item => {
    obj[item] = parseObject.get(item)
  })
  return obj
}

export function convertObjects(parseObjects){
  const map = new Map()
  parseObjects.forEach(obj => {
    map.set(obj.id, returnSimpleObject(obj))
  })
  return map;
}
