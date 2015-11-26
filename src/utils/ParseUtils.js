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
    const val = parseObject.get(item)
    if(item == 'location'){
      obj[item] = [val.latitude, val.longitude]
    } else {
      obj[item] = val
    }
  })
  return obj
}

export function convertObjects(parseObjects){
  const map = new Map()
  parseObjects.forEach(obj => {
    map.set(obj.get('slug'), returnSimpleObject(obj))
  })
  return map;
}
