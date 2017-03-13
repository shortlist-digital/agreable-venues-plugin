const dataColumns = [
  'brands',
  'closing_date',
  'contact',
  'distance',
  'id',
  'image_url',
  'info',
  'lat',
  'lng',
  'name',
  'opening_date',
  'price',
  'promotion',
  'slug',
  'tags',
  'venueTypes'
];

function returnSimpleObject(parseObject) {
  const obj = {
    location: {}
  }

  dataColumns.forEach(item => {
    const val = parseObject[item]
    if (val && ['brands', 'venueTypes', 'tags'].indexOf(item) > -1) {
      obj[item] = Array.from(val, (obj) => {
        return { slug : obj.slug, name : obj.name }
      })
    } else if (item == 'lat') {
      obj.location['lat'] = val;
    } else if (item == 'lng') {
      obj.location['lng'] = val;
    } else {
      obj[item] = val
    }
  })

  return obj
}

export function convertObjects(parseObjects) {
  const map = new Map()

  parseObjects.forEach(obj => {
    if (obj !== null) {
      if (Object.keys(obj).length > 0) {
        map.set(obj.slug, returnSimpleObject(obj))
      }
    }
  })

  return map;
}
