import { Parse } from 'parse';

const parseColumns = [
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
  'VenueTypes',
  'Brands',
  'Tags'
];

export function getVenueQuery(parse){

  const q = new Parse.Query("Venue")
  q.include("Brands")
  q.include("VenueTypes")
  q.include("Tags")

  if(parse.brands.length){
    const brandQuery = new Parse.Query("Brand")
    brandQuery.containedIn("slug", parse.brands)
    q.matchesQuery("Brands", brandQuery)
  }

  if(parse.venue_types.length){
    const typeQuery = new Parse.Query("VenueType")
    typeQuery.containedIn("slug", parse.venue_types)
    q.matchesQuery("VenueTypes", typeQuery)
  }

  if(parse.tags.length){
    const tagQuery = new Parse.Query("Tag")
    tagQuery.containedIn("slug", parse.tags)
    q.matchesQuery("Tags", tagQuery)
  }

  q.equalTo("status", "publish");

  return q
}

function returnSimpleObject(parseObject){
  const obj = { }
  parseColumns.forEach(item => {
    const val = parseObject.get(item)
    if(val && ['Brands', 'VenueTypes', 'Tags'].indexOf(item) > -1){
      obj[item] = Array.from(val, (obj) => {
        return { slug : obj.get('slug'), name : obj.get('name') }
      })
    } else if(item == 'location'){
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
