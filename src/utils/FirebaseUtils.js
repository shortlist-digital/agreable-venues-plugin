const firebaseColumns = [
  'name',
  'address',
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
  'venueTypes',
  'brands',
  'tags'
];

function returnSimpleObject(parseObject) {
  const obj = { }

  firebaseColumns.forEach(item => {
    const val = parseObject[item]
    if (val && ['brands', 'venueTypes', 'tags'].indexOf(item) > -1) {
      obj[item] = Array.from(val, (obj) => {
        return { slug : obj.slug, name : obj.name }
      })
    } else if (item == 'location') {
      obj[item] = {
        lat: val.lat,
        lng: val.lng
      }
    } else {
      obj[item] = val
    }
  })

  return obj
}

export function convertObjects(parseObjects) {
  const map = new Map()

  parseObjects.forEach(obj => {
    if (Object.keys(obj).length > 0) {
      map.set(obj.slug, returnSimpleObject(obj))
    }
  })

  return map;
}
